import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
];

interface TrendItem {
  category: string;
  name: string;
  trend: "rising" | "stable" | "declining";
  priority_score: number; // 0-100
  recommended_actions: string[];
  reason: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const PUBLISHABLE = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

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

    // Aggregate seed_template counts as a proxy for category coverage
    const { data: templates } = await admin
      .from("seed_templates")
      .select("category")
      .eq("is_active", true);
    const counts = new Map<string, number>();
    for (const t of templates ?? []) {
      const k = (t as { category: string }).category;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    const categoryStats = KNOWN_CATEGORIES.map((c) => ({
      category: c.slug,
      name: c.name,
      template_count: counts.get(c.slug) ?? 0,
    }));

    const systemPrompt = `Ты — AI-стратег развития доски объявлений в Нефтеюганске (ХМАО, ~120k жителей, нефтегазовый регион).
Проанализируй покрытие категорий и выдай тренд + приоритет развития для каждой.

Учитывай специфику региона:
- Сильно: транспорт (внедорожники, грузовики), недвижимость (вахта), работа (нефтянка), спецтехника
- Слабо: люкс-товары, экзотические хобби

Для каждой категории определи trend (rising/stable/declining), priority_score 0-100 и 2-3 конкретных действия.`;

    const userPrompt = `Текущее покрытие категорий (количество шаблонов объявлений):
${categoryStats.map((s) => `- ${s.name}: ${s.template_count}`).join("\n")}

Выдай анализ через tool call.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_trends",
            description: "Анализ трендов категорий и приоритетов развития",
            parameters: {
              type: "object",
              properties: {
                trends: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      name: { type: "string" },
                      trend: { type: "string", enum: ["rising", "stable", "declining"] },
                      priority_score: { type: "integer", minimum: 0, maximum: 100 },
                      recommended_actions: { type: "array", items: { type: "string" } },
                      reason: { type: "string" },
                    },
                    required: ["category", "name", "trend", "priority_score", "recommended_actions", "reason"],
                    additionalProperties: false,
                  },
                },
                summary: { type: "string", description: "Общий вывод 2-3 предложения" },
              },
              required: ["trends", "summary"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "analyze_trends" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Превышен лимит AI-запросов" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Недостаточно AI-кредитов" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI did not return analysis");
    const parsed = JSON.parse(toolCall.function.arguments) as { trends: TrendItem[]; summary: string };

    // Persist top-priority trends as recommendations
    let created = 0;
    for (const t of parsed.trends.filter((x) => x.priority_score >= 70)) {
      const title = `Тренд: ${t.name} (${t.trend})`;
      const { data: existing } = await admin
        .from("growth_recommendations")
        .select("id")
        .eq("title", title)
        .eq("is_dismissed", false)
        .eq("is_applied", false)
        .limit(1);
      if (existing && existing.length) continue;

      const { error: insErr } = await admin.from("growth_recommendations").insert({
        type: "category_growth",
        priority: t.priority_score >= 85 ? "high" : "medium",
        title,
        description: `${t.reason} Действия: ${t.recommended_actions.join("; ")}`,
        action_data: { category: t.category, ...t },
      });
      if (!insErr) created++;
    }

    return new Response(JSON.stringify({
      ok: true,
      summary: parsed.summary,
      trends: parsed.trends,
      created_recommendations: created,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("trend-analyzer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
