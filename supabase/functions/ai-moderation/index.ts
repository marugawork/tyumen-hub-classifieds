// AI Moderation Engine — scores listings for risk, fraud, prohibited content.
// Uses the shared AI service layer (_shared/ai-service.ts).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { AiError, callAiModule } from "../_shared/ai-service.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

type ModerationResult = {
  moderation_score: number;
  fraud_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  status: "approved" | "review_required" | "blocked";
  violations: string[];
  explanation: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { title, description, price, category, photos_count } = await req.json();
    if (!title || !description) return json({ error: "title and description required" }, 400);

    const result = await callAiModule<ModerationResult>({
      module: "ai-moderation",
      system: "Ты — модератор досок объявлений. Анализируешь риски: запрещённые товары, наркотики, оружие, скам, фишинг, фейковые услуги, поддельные вакансии, дубли спама. Возвращай только структурированный JSON через инструмент.",
      user: `Категория: ${String(category ?? "не указана").slice(0, 100)}\nЦена: ${price ?? "не указана"}\nФото: ${photos_count ?? 0}\nЗаголовок: ${String(title).slice(0, 200)}\nОписание: ${String(description).slice(0, 3000)}`,
      tool: {
        name: "moderate_listing",
        description: "Вернуть оценку модерации",
        parameters: {
          type: "object",
          properties: {
            moderation_score: { type: "number" },
            fraud_score: { type: "number" },
            risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            status: { type: "string", enum: ["approved", "review_required", "blocked"] },
            violations: { type: "array", items: { type: "string" } },
            explanation: { type: "string" },
          },
          required: ["moderation_score", "fraud_score", "risk_level", "status", "violations", "explanation"],
          additionalProperties: false,
        },
      },
      abortSignal: req.signal,
    });

    return json(result);
  } catch (e) {
    if (e instanceof AiError) return json({ error: e.message }, e.status);
    console.error("ai-moderation error:", e);
    return json({ error: "Ошибка модерации" }, 500);
  }
});
