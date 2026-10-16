// Smart search — ranks candidate listings by meaning of a visitor's free-text request.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "../_shared/run-id.ts";

const MODEL = "openai/gpt-6-astra";
const MAX_CANDIDATES = 400;
const MAX_RESULTS = 12;

type Candidate = { id: string; t: string; c?: string; p?: number; d?: string };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI не настроен" }, 500);

    const { query, candidates } = await req.json();
    const q = String(query ?? "").trim().slice(0, 500);
    if (q.length < 3) return json({ error: "Опишите, что вы ищете (минимум 3 символа)" }, 400);
    if (!Array.isArray(candidates) || !candidates.length) return json({ results: [] });

    const list: Candidate[] = candidates.slice(0, MAX_CANDIDATES).map((c: Candidate) => ({
      id: String(c.id).slice(0, 64),
      t: String(c.t ?? "").slice(0, 120),
      c: c.c ? String(c.c).slice(0, 40) : undefined,
      p: typeof c.p === "number" ? c.p : undefined,
      d: c.d ? String(c.d).slice(0, 40) : undefined,
    }));
    const ids = new Set(list.map((c) => c.id));
    const catalog = list.map((c) => `${c.id}|${c.t}|${c.c ?? ""}|${c.p ?? ""}₽|${c.d ?? ""}`).join("\n");

    const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: provider.responses(MODEL),
      system:
        "Ты — умный поиск доски объявлений города Нефтеюганск. По описанию посетителя выбери наиболее подходящие по смыслу объявления из каталога (формат строки: id|заголовок|категория|цена|район). Учитывай синонимы, назначение, бюджет и район, если они упомянуты. Не выдумывай id. " +
        `Ответь только JSON вида {"results":[{"id":"...","reason":"коротко, до 12 слов, по-русски"}]} — от лучшего к худшему, не более ${MAX_RESULTS}. Если ничего не подходит — {"results":[]}.`,
      messages: [{ role: "user", content: `Запрос: ${q}\n\nКаталог:\n${catalog}` }],
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    let text: string;
    try {
      text = await result.text;
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return json({ error: "Слишком много запросов, попробуйте через минуту" }, 429);
      if (status === 402) return json({ error: "Закончились AI-кредиты" }, 402);
      if (status === 403) return json({ error: "AI-поиск временно недоступен" }, 403);
      throw e;
    }

    const match = text.match(/\{[\s\S]*\}/);
    let parsed: { results?: { id: string; reason?: string }[] } = {};
    try { parsed = match ? JSON.parse(match[0]) : {}; } catch { parsed = {}; }
    const seen = new Set<string>();
    const results = (parsed.results ?? [])
      .filter((r) => r && ids.has(String(r.id)) && !seen.has(String(r.id)) && seen.add(String(r.id)))
      .slice(0, MAX_RESULTS)
      .map((r) => ({ id: String(r.id), reason: String(r.reason ?? "").slice(0, 120) }));

    return json({ results });
  } catch (e) {
    console.error("smart-search error", e);
    return json({ error: "Не удалось выполнить AI-поиск" }, 500);
  }
});
