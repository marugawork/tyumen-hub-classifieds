// AI Control Center — admin-only overview and configuration of AI modules.
// Requires a valid JWT of a super_admin user.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { AI_MODULES } from "../_shared/ai-service.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function requireSuperAdmin(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return null;

  const sb = createClient(url, serviceKey);
  const token = auth.slice(7);
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return null;

  const { data: isSuper } = await sb.rpc("has_role", { _user_id: user.id, _role: "super_admin" });
  if (!isSuper) return null;
  return { sb, user };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const ctx = await requireSuperAdmin(req);
  if (!ctx) return json({ error: "Доступ запрещён" }, 403);
  const { sb } = ctx;

  try {
    if (req.method === "GET") {
      // Module configs (missing rows fall back to registry defaults)
      const { data: configs } = await sb.from("ai_module_config").select("*");

      // Usage stats for the last 30 days, computed from the real log only
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: rows } = await sb
        .from("ai_usage_log")
        .select("module, status, duration_ms, error, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);

      const stats: Record<string, {
        total: number; success: number; failed: number;
        avg_duration_ms: number | null; last_success_at: string | null;
        last_error: string | null; last_error_at: string | null;
      }> = {};

      for (const r of rows ?? []) {
        const s = (stats[r.module] ??= {
          total: 0, success: 0, failed: 0,
          avg_duration_ms: null, last_success_at: null,
          last_error: null, last_error_at: null,
        });
        s.total++;
        if (r.status === "success") {
          s.success++;
          if (!s.last_success_at) s.last_success_at = r.created_at;
        } else {
          s.failed++;
          if (!s.last_error) { s.last_error = r.error; s.last_error_at = r.created_at; }
        }
      }
      for (const m of Object.keys(stats)) {
        const durations = (rows ?? []).filter((r) => r.module === m && typeof r.duration_ms === "number").map((r) => r.duration_ms as number);
        stats[m].avg_duration_ms = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
      }

      const modules = Object.entries(AI_MODULES).map(([name, spec]) => {
        const cfg = (configs ?? []).find((c) => c.module === name);
        return {
          module: name,
          description: spec.description,
          model: cfg?.model ?? spec.model,
          enabled: cfg?.enabled ?? true,
          daily_limit: cfg?.daily_limit ?? 1000,
          updated_at: cfg?.updated_at ?? null,
          stats: stats[name] ?? null,
        };
      });

      return json({
        modules,
        provider: { gateway: "Lovable AI Gateway", key_configured: Boolean(Deno.env.get("LOVABLE_API_KEY")) },
      });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const module = String(body.module ?? "");
      if (!AI_MODULES[module]) return json({ error: "Неизвестный модуль" }, 400);

      const update: Record<string, unknown> = { module, updated_by: ctx.user.id, updated_at: new Date().toISOString() };
      if (typeof body.enabled === "boolean") update.enabled = body.enabled;
      if (typeof body.daily_limit === "number" && body.daily_limit >= 0 && body.daily_limit <= 100000) {
        update.daily_limit = Math.floor(body.daily_limit);
      }
      update.model = AI_MODULES[module].model; // model changes require a code change, not admin input

      const { error } = await sb.from("ai_module_config").upsert(update, { onConflict: "module" });
      if (error) return json({ error: "Не удалось сохранить конфигурацию" }, 500);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    console.error("ai-control error:", e);
    return json({ error: "Внутренняя ошибка" }, 500);
  }
});
