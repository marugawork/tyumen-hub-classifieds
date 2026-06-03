// AI Moderation Engine — scores listings for risk, fraud, prohibited content.
// City-independent: pass city via payload, no hard-coded geography.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { title, description, price, category, photos_count } = await req.json();
    if (!title || !description) {
      return new Response(JSON.stringify({ error: "title and description required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Ты — модератор досок объявлений. Анализируешь риски: запрещённые товары, наркотики, оружие, скам, фишинг, фейковые услуги, поддельные вакансии, дубли спама. Возвращай только структурированный JSON через инструмент." },
          { role: "user", content: `Категория: ${category ?? "не указана"}\nЦена: ${price ?? "не указана"}\nФото: ${photos_count ?? 0}\nЗаголовок: ${title}\nОписание: ${description}` },
        ],
        tools: [{
          type: "function",
          function: {
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
        }],
        tool_choice: { type: "function", function: { name: "moderate_listing" } },
      }),
    });

    if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (res.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);

    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : null;
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("ai-moderation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
