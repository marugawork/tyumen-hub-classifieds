import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdvisorRequest {
  listing: {
    id?: string;
    title: string;
    category: string;
    price?: number;
    description?: string;
    views?: number;
    contacts?: number;
    days_active?: number;
    district?: string;
  };
}

interface PromotionPackage {
  package: "vip" | "top" | "urgent" | "up";
  duration_days: number;
  price_kopecks: number;
  expected_views_uplift_pct: number;
  expected_contacts_uplift_pct: number;
  reason: string;
  confidence: "low" | "medium" | "high";
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

    const body = (await req.json()) as AdvisorRequest;
    if (!body?.listing?.title || !body?.listing?.category) {
      return new Response(JSON.stringify({ error: "listing.title and listing.category required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Ты — AI-аналитик доски объявлений нефтеюганск.инфо.
На основе данных об объявлении выбери оптимальный пакет продвижения и обоснуй.

Доступные пакеты (цены в копейках):
- vip: 7 дней, 49900 коп. (закреп в топе категории, рамка)
- top: 3 дня, 19900 коп. (выделение цвета, выше в выдаче)
- urgent: 7 дней, 9900 коп. (метка "Срочно")
- up: 1 день, 4900 коп. (поднять наверх ленты)

Логика:
- Дорогие или премиум товары → vip
- Низкий CTR (мало контактов на просмотры) → top или vip с улучшением
- Старое объявление (>14 дней) с низкими просмотрами → up серия
- Сезонные / срочные продажи → urgent
- Если объявление новое и метрик ещё нет — рекомендуй up на 3-5 дней

Верни ровно одну рекомендацию через tool call.`;

    const userPrompt = `Объявление:
- Заголовок: ${body.listing.title}
- Категория: ${body.listing.category}
- Цена: ${body.listing.price ?? "не указана"} ₽
- Район: ${body.listing.district ?? "не указан"}
- Дней в ленте: ${body.listing.days_active ?? 0}
- Просмотры: ${body.listing.views ?? 0}
- Обращения: ${body.listing.contacts ?? 0}
- Описание: ${body.listing.description?.slice(0, 300) ?? "—"}`;

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
            name: "recommend_promotion",
            description: "Рекомендовать пакет продвижения для объявления",
            parameters: {
              type: "object",
              properties: {
                package: { type: "string", enum: ["vip", "top", "urgent", "up"] },
                duration_days: { type: "integer", minimum: 1, maximum: 30 },
                price_kopecks: { type: "integer" },
                expected_views_uplift_pct: { type: "integer", minimum: 0, maximum: 500 },
                expected_contacts_uplift_pct: { type: "integer", minimum: 0, maximum: 500 },
                reason: { type: "string", description: "Короткое обоснование на русском, 1-2 предложения" },
                confidence: { type: "string", enum: ["low", "medium", "high"] },
              },
              required: ["package", "duration_days", "price_kopecks", "expected_views_uplift_pct", "expected_contacts_uplift_pct", "reason", "confidence"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "recommend_promotion" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Превышен лимит AI-запросов, попробуйте позже" }), {
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
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return a recommendation");
    }
    const recommendation = JSON.parse(toolCall.function.arguments) as PromotionPackage;

    // Persist as growth_recommendation for audit / dashboard
    if (body.listing.id) {
      await admin.from("growth_recommendations").insert({
        type: "ad_placement",
        priority: recommendation.confidence === "high" ? "high" : "medium",
        title: `Продвижение: ${body.listing.title.slice(0, 60)}`,
        description: `${recommendation.package.toUpperCase()} на ${recommendation.duration_days} дн. — ${recommendation.reason}`,
        action_data: { listing_id: body.listing.id, ...recommendation },
      });
    }

    return new Response(JSON.stringify({ ok: true, recommendation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("promotion-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
