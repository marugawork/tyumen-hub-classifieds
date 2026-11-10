// AI Price Advisor — suggests recommended price + range + demand level.
// Uses the shared AI service layer (_shared/ai-service.ts).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { AiError, callAiModule } from "../_shared/ai-service.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

type PriceAdvice = {
  recommended: number;
  min: number;
  max: number;
  demand: "low" | "medium" | "high";
  rationale: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { title, description, category, condition, city } = await req.json();
    if (!title) return json({ error: "title required" }, 400);

    const result = await callAiModule<PriceAdvice>({
      module: "price-advisor",
      system: `Ты — оценщик товаров на досках объявлений. Город: ${String(city ?? "региональный РФ").slice(0, 100)}. Цены в рублях. Учитывай локальный рынок небольшого города.`,
      user: `Категория: ${String(category ?? "—").slice(0, 100)}\nСостояние: ${String(condition ?? "—").slice(0, 50)}\nЗаголовок: ${String(title).slice(0, 200)}\nОписание: ${String(description ?? "—").slice(0, 2000)}`,
      tool: {
        name: "suggest_price",
        parameters: {
          type: "object",
          properties: {
            recommended: { type: "number" },
            min: { type: "number" },
            max: { type: "number" },
            demand: { type: "string", enum: ["low", "medium", "high"] },
            rationale: { type: "string" },
          },
          required: ["recommended", "min", "max", "demand", "rationale"],
          additionalProperties: false,
        },
      },
      abortSignal: req.signal,
    });

    return json(result);
  } catch (e) {
    if (e instanceof AiError) return json({ error: e.message }, e.status);
    console.error("price-advisor error:", e);
    return json({ error: "Ошибка подсказки цены" }, 500);
  }
});
