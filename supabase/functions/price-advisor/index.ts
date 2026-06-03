// AI Price Advisor — suggests recommended price + range + demand level.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { title, description, category, condition, city } = await req.json();
    if (!title) {
      return new Response(JSON.stringify({ error: "title required" }), {
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
          { role: "system", content: `Ты — оценщик товаров на досках объявлений. Город: ${city ?? "региональный РФ"}. Цены в рублях. Учитывай локальный рынок небольшого города.` },
          { role: "user", content: `Категория: ${category ?? "—"}\nСостояние: ${condition ?? "—"}\nЗаголовок: ${title}\nОписание: ${description ?? "—"}` },
        ],
        tools: [{
          type: "function",
          function: {
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
        }],
        tool_choice: { type: "function", function: { name: "suggest_price" } },
      }),
    });

    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(JSON.stringify(args ? JSON.parse(args) : null), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("price-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
