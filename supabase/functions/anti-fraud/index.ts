// Anti-fraud — analyses listings + users for duplicate / suspicious patterns.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "items[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sample = items.slice(0, 50).map((i, idx) => `[${idx}] tel=${i.phone ?? "—"} title="${i.title}" price=${i.price ?? "—"} desc="${(i.description ?? "").slice(0, 120)}"`).join("\n");

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Ты — антифрод-аналитик. Находишь дубли объявлений, спам, подозрительные цены, массовые публикации, одинаковые телефоны." },
          { role: "user", content: `Проанализируй пачку объявлений:\n${sample}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_fraud",
            parameters: {
              type: "object",
              properties: {
                flagged: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      index: { type: "number" },
                      fraud_score: { type: "number" },
                      reasons: { type: "array", items: { type: "string" } },
                      group: { type: "string", enum: ["duplicate", "spam", "suspicious_price", "fake_seller", "phishing", "other"] },
                    },
                    required: ["index", "fraud_score", "reasons", "group"],
                    additionalProperties: false,
                  },
                },
                summary: { type: "string" },
              },
              required: ["flagged", "summary"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "analyze_fraud" } },
      }),
    });

    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(JSON.stringify(args ? JSON.parse(args) : { flagged: [], summary: "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("anti-fraud error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
