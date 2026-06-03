// AI Listing Generator — from a short keyword/seed, produce title/desc/tags/category.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { seed, city, available_categories } = await req.json();
    if (!seed || typeof seed !== "string" || seed.length < 2) {
      return new Response(JSON.stringify({ error: "seed required (min 2 chars)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const cats = Array.isArray(available_categories) ? available_categories.join(", ") : "любые";

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: `Ты — копирайтер досок объявлений. Город: ${city ?? "не указан"}. Доступные категории: ${cats}. Пиши коротко, по делу, без воды.` },
          { role: "user", content: `Сгенерируй объявление для: "${seed}"` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_listing",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
                keywords: { type: "array", items: { type: "string" } },
              },
              required: ["title", "description", "category", "tags", "keywords"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_listing" } },
      }),
    });

    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(JSON.stringify(args ? JSON.parse(args) : null), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("listing-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
