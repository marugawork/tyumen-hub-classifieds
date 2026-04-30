import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static category list mirrors src/data/categories.ts top-level slugs.
// In a future phase this will pull from a real listings table.
const KNOWN_CATEGORIES = [
  { slug: "transport", name: "Транспорт" },
  { slug: "nedvizhimost", name: "Недвижимость" },
  { slug: "rabota", name: "Работа" },
  { slug: "uslugi", name: "Услуги" },
  { slug: "lichnye-veshchi", name: "Личные вещи" },
  { slug: "dom-i-sad", name: "Дом и сад" },
  { slug: "elektronika", name: "Электроника" },
  { slug: "hobbi", name: "Хобби и отдых" },
  { slug: "zhivotnye", name: "Животные" },
  { slug: "biznes", name: "Бизнес и оборудование" },
  { slug: "otdam-darom", name: "Отдам даром" },
  { slug: "obmen", name: "Обмен" },
];

interface DetectorRequest {
  threshold?: number; // categories with seed_templates count below this are "empty"
  city?: string;
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

    const body = (await req.json().catch(() => ({}))) as DetectorRequest;
    const threshold = Math.max(body.threshold ?? 5, 0);

    // Count seed templates per category
    const { data: templates, error } = await admin
      .from("seed_templates")
      .select("category")
      .eq("is_active", true);
    if (error) throw error;

    const counts = new Map<string, number>();
    for (const t of templates ?? []) {
      const k = (t as { category: string }).category;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    const report = KNOWN_CATEGORIES.map((c) => ({
      category: c.slug,
      name: c.name,
      template_count: counts.get(c.slug) ?? 0,
      is_empty: (counts.get(c.slug) ?? 0) < threshold,
    }));
    const empty = report.filter((r) => r.is_empty);

    // Create growth_recommendations for empty categories (one per missing cat, dedup by title)
    let createdRecommendations = 0;
    for (const e of empty) {
      const title = `Пустая категория: ${e.name}`;
      // Check duplicate
      const { data: existing } = await admin
        .from("growth_recommendations")
        .select("id")
        .eq("title", title)
        .eq("is_dismissed", false)
        .eq("is_applied", false)
        .limit(1);
      if (existing && existing.length) continue;

      const { error: insErr } = await admin.from("growth_recommendations").insert({
        type: "seed_category",
        priority: e.template_count === 0 ? "high" : "medium",
        title,
        description: `В категории "${e.name}" всего ${e.template_count} шаблонов. Запустите AI Seed Generator чтобы наполнить категорию.`,
        action_data: { category: e.category, current_count: e.template_count, threshold },
      });
      if (!insErr) createdRecommendations++;
    }

    return new Response(JSON.stringify({
      ok: true,
      threshold,
      total_categories: report.length,
      empty_count: empty.length,
      report,
      created_recommendations: createdRecommendations,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("empty-category-detector error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
