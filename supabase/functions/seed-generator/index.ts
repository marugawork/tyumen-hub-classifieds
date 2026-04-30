import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SeedRequest {
  category: string;
  city?: string;
  count?: number;
  saveAsTemplates?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: isAdmin } = await admin.rpc("is_admin", { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as SeedRequest;
    const category = (body.category || "").trim();
    const city = (body.city || "Нефтеюганск").trim();
    const count = Math.min(Math.max(body.count ?? 5, 1), 15);
    const saveAsTemplates = body.saveAsTemplates !== false;

    if (!category) {
      return new Response(JSON.stringify({ error: "category is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Ты помощник для генерации реалистичных тестовых объявлений для российской доски объявлений в городе ${city}. Цены в рублях. Тексты на русском, без эмодзи, без рекламы, без выдуманных номеров телефонов.`,
          },
          {
            role: "user",
            content: `Сгенерируй ${count} реалистичных стартовых объявлений для категории "${category}". Верни через tool call.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_listings",
              description: "Возвращает массив сгенерированных объявлений",
              parameters: {
                type: "object",
                properties: {
                  listings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Короткий заголовок 30-70 симв" },
                        description: { type: "string", description: "Описание 100-300 симв" },
                        price_min: { type: "integer", description: "Минимальная адекватная цена в рублях" },
                        price_max: { type: "integer", description: "Максимальная цена в рублях" },
                        attributes: {
                          type: "object",
                          description: "Произвольные атрибуты — состояние, бренд, год и т.п.",
                        },
                      },
                      required: ["title", "description", "price_min", "price_max"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["listings"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_listings" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      const status = aiResp.status === 429 || aiResp.status === 402 ? aiResp.status : 500;
      const msg = aiResp.status === 429
        ? "Превышен лимит AI-запросов, попробуйте позже"
        : aiResp.status === 402
        ? "Закончились AI-кредиты Lovable AI"
        : `AI error: ${t}`;
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return tool call");
    const parsed = JSON.parse(toolCall.function.arguments);
    const listings = parsed.listings as Array<{
      title: string;
      description: string;
      price_min: number;
      price_max: number;
      attributes?: Record<string, unknown>;
    }>;

    let savedCount = 0;
    if (saveAsTemplates && listings.length) {
      const rows = listings.map((l) => ({
        category,
        title_pattern: l.title,
        description_pattern: l.description,
        price_min: l.price_min ?? null,
        price_max: l.price_max ?? null,
        attributes: l.attributes ?? {},
        is_active: true,
      }));
      const { error: insErr, count } = await admin
        .from("seed_templates")
        .insert(rows, { count: "exact" });
      if (insErr) console.error("insert error:", insErr);
      else savedCount = count ?? rows.length;
    }

    return new Response(
      JSON.stringify({ ok: true, generated: listings.length, saved: savedCount, listings }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("seed-generator error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
