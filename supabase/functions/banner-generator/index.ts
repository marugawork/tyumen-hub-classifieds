// AI Banner Generator — produces ad copy for business accounts. Text only, no images.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { business_name, service, offer, city } = await req.json();
    if (!business_name || !service) {
      return new Response(JSON.stringify({ error: "business_name and service required" }), {
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
          { role: "system", content: `Ты — копирайтер рекламы. Город: ${city ?? "региональный РФ"}. Заголовки — короткие и цепляющие, без кликбейта.` },
          { role: "user", content: `Компания: ${business_name}\nУслуга: ${service}\nПредложение: ${offer ?? "—"}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_banner",
            parameters: {
              type: "object",
              properties: {
                headline: { type: "string" },
                body: { type: "string" },
                concept: { type: "string" },
                cta: { type: "string" },
              },
              required: ["headline", "body", "concept", "cta"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_banner" } },
      }),
    });

    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(JSON.stringify(args ? JSON.parse(args) : null), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("banner-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
