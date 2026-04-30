import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImportRequest {
  csv: string;            // raw CSV text
  category?: string;
  city?: string;
  source?: "csv" | "api" | "manual";
}

// Minimal CSV parser handling quoted values & commas inside quotes.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const PUBLISHABLE = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, PUBLISHABLE, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: isAdmin } = await admin.rpc("is_admin", { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as ImportRequest;
    if (!body.csv || typeof body.csv !== "string") {
      return new Response(JSON.stringify({ error: "csv field required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const category = body.category?.trim();
    const city = body.city?.trim() || "neftyugansk";
    const source = (body.source ?? "csv") as "csv" | "api" | "manual";

    const rows = parseCSV(body.csv);
    if (rows.length < 2) {
      return new Response(JSON.stringify({ error: "CSV must have a header row and at least one data row" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const dataRows = rows.slice(1);

    const required = ["title", "description"];
    const missing = required.filter((r) => !header.includes(r));
    if (missing.length) {
      return new Response(JSON.stringify({ error: `Missing required columns: ${missing.join(", ")}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create import job
    const { data: job, error: jobErr } = await admin.from("import_jobs").insert({
      source,
      category: category ?? null,
      city,
      total_rows: dataRows.length,
      processed_rows: 0,
      failed_rows: 0,
      status: "processing",
      started_at: new Date().toISOString(),
      created_by: user.id,
      payload: { header, sample: dataRows.slice(0, 3) },
    }).select().single();
    if (jobErr || !job) throw new Error(jobErr?.message ?? "Failed to create job");

    const idx = (name: string) => header.indexOf(name);
    const tIdx = idx("title");
    const dIdx = idx("description");
    const pMinIdx = idx("price_min");
    const pMaxIdx = idx("price_max");

    const errors: Array<{ row: number; reason: string }> = [];
    const templates: Array<Record<string, unknown>> = [];
    for (let i = 0; i < dataRows.length; i++) {
      const r = dataRows[i];
      const title = (r[tIdx] ?? "").trim();
      const desc = (r[dIdx] ?? "").trim();
      if (!title || !desc) {
        errors.push({ row: i + 2, reason: "title or description empty" });
        continue;
      }
      const pMin = pMinIdx >= 0 ? Number(r[pMinIdx]) : null;
      const pMax = pMaxIdx >= 0 ? Number(r[pMaxIdx]) : null;
      templates.push({
        category: category ?? "uncategorized",
        title_pattern: title,
        description_pattern: desc,
        price_min: Number.isFinite(pMin as number) ? pMin : null,
        price_max: Number.isFinite(pMax as number) ? pMax : null,
        attributes: {},
        is_active: true,
      });
    }

    let inserted = 0;
    if (templates.length) {
      const { error: insErr, count } = await admin
        .from("seed_templates")
        .insert(templates, { count: "exact" });
      if (insErr) {
        errors.push({ row: 0, reason: `bulk insert failed: ${insErr.message}` });
      } else {
        inserted = count ?? templates.length;
      }
    }

    await admin.from("import_jobs").update({
      processed_rows: inserted,
      failed_rows: errors.length,
      status: errors.length === dataRows.length ? "failed" : "completed",
      finished_at: new Date().toISOString(),
      error_log: errors.slice(0, 100),
    }).eq("id", job.id);

    return new Response(JSON.stringify({
      ok: true,
      job_id: job.id,
      total: dataRows.length,
      inserted,
      failed: errors.length,
      errors: errors.slice(0, 20),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("csv-import error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
