// Shared server-side AI service layer for Нефтеюганск.инфо.
// Central provider config, module registry, error mapping, usage logging.
// All AI calls go through Lovable AI Gateway; the key never leaves the server.
import { createClient } from "npm:@supabase/supabase-js@2";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Registry of AI modules. Models reflect current production usage — do not
// change a model here without an explicit user request.
export const AI_MODULES: Record<string, { model: string; description: string; timeoutMs: number }> = {
  "ai-moderation": { model: "google/gemini-3-flash-preview", description: "Модерация объявлений", timeoutMs: 30_000 },
  "anti-fraud": { model: "google/gemini-3-flash-preview", description: "Антифрод-анализ", timeoutMs: 30_000 },
  "listing-generator": { model: "google/gemini-3-flash-preview", description: "Генерация заголовка и описания", timeoutMs: 30_000 },
  "price-advisor": { model: "google/gemini-3-flash-preview", description: "Подсказка цены", timeoutMs: 30_000 },
  "banner-generator": { model: "google/gemini-3-flash-preview", description: "Генерация рекламных баннеров", timeoutMs: 30_000 },
  "promotion-advisor": { model: "google/gemini-3-flash-preview", description: "Советы по продвижению", timeoutMs: 45_000 },
  "trend-analyzer": { model: "google/gemini-3-flash-preview", description: "Анализ трендов спроса", timeoutMs: 45_000 },
  "seed-generator": { model: "google/gemini-3-flash-preview", description: "Генерация стартовых объявлений", timeoutMs: 60_000 },
  "smart-search": { model: "openai/gpt-6-astra", description: "Умный поиск по смыслу", timeoutMs: 60_000 },
};

export class AiError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryable = false,
  ) {
    super(message);
  }
}

// Map gateway HTTP statuses to safe client-facing errors (ai-gateway-error-semantics).
export function mapGatewayError(status: number): AiError {
  switch (status) {
    case 400: return new AiError(400, "Некорректный запрос к AI");
    case 401: return new AiError(500, "AI не настроен на сервере");
    case 402: return new AiError(402, "Закончились AI-кредиты");
    case 403: return new AiError(403, "AI-модуль временно недоступен");
    case 404: return new AiError(503, "AI-модель недоступна");
    case 429: return new AiError(429, "Слишком много запросов, попробуйте через минуту", true);
    default:
      return status >= 500
        ? new AiError(503, "AI-сервис временно недоступен, попробуйте позже", true)
        : new AiError(500, "Ошибка AI-сервиса");
  }
}

function serviceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  return createClient(url, key);
}

// Best-effort usage logging — never breaks the AI call itself.
export async function logUsage(entry: {
  module: string;
  model: string;
  status: "success" | "error";
  duration_ms: number;
  error?: string;
}) {
  try {
    const sb = serviceClient();
    if (!sb) return;
    await sb.from("ai_usage_log").insert({
      module: entry.module.slice(0, 64),
      model: entry.model.slice(0, 128),
      status: entry.status,
      duration_ms: entry.duration_ms,
      error: entry.error?.slice(0, 500) ?? null,
    });
  } catch (e) {
    console.error("ai_usage_log insert failed", e);
  }
}

// Check module config (enabled flag). Missing config row = enabled with registry defaults.
export async function assertModuleEnabled(module: string) {
  const sb = serviceClient();
  if (!sb) return;
  const { data } = await sb.from("ai_module_config").select("enabled").eq("module", module).maybeSingle();
  if (data && data.enabled === false) {
    throw new AiError(503, "AI-модуль отключён администратором");
  }
}

export type ToolSchema = {
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
};

// Call the gateway with a forced tool call and return the parsed tool arguments.
// Handles config check, timeout, error mapping, and usage logging.
export async function callAiModule<T>(opts: {
  module: string;
  system: string;
  user: string;
  tool: ToolSchema;
  abortSignal?: AbortSignal;
}): Promise<T> {
  const spec = AI_MODULES[opts.module];
  if (!spec) throw new AiError(500, `Неизвестный AI-модуль: ${opts.module}`);

  await assertModuleEnabled(opts.module);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new AiError(500, "AI не настроен на сервере");

  const started = Date.now();
  const timeout = AbortSignal.timeout(spec.timeoutMs);
  const signal = opts.abortSignal
    ? AbortSignal.any([opts.abortSignal, timeout])
    : timeout;

  try {
    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        model: spec.model,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        tools: [{
          type: "function",
          function: {
            name: opts.tool.name,
            description: opts.tool.description ?? "Вернуть структурированный результат",
            parameters: opts.tool.parameters,
          },
        }],
        tool_choice: { type: "function", function: { name: opts.tool.name } },
      }),
    });

    if (!res.ok) {
      const err = mapGatewayError(res.status);
      await logUsage({ module: opts.module, model: spec.model, status: "error", duration_ms: Date.now() - started, error: `gateway ${res.status}` });
      throw err;
    }

    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) {
      await logUsage({ module: opts.module, model: spec.model, status: "error", duration_ms: Date.now() - started, error: "empty tool response" });
      throw new AiError(502, "AI вернул пустой ответ");
    }

    let parsed: T;
    try {
      parsed = JSON.parse(args) as T;
    } catch {
      await logUsage({ module: opts.module, model: spec.model, status: "error", duration_ms: Date.now() - started, error: "invalid JSON in tool response" });
      throw new AiError(502, "AI вернул некорректный ответ");
    }

    await logUsage({ module: opts.module, model: spec.model, status: "success", duration_ms: Date.now() - started });
    return parsed;
  } catch (e) {
    if (e instanceof AiError) throw e;
    const isAbort = e instanceof DOMException && (e.name === "AbortError" || e.name === "TimeoutError");
    const err = isAbort ? new AiError(504, "AI не ответил вовремя, попробуйте ещё раз", true) : e;
    await logUsage({
      module: opts.module,
      model: spec.model,
      status: "error",
      duration_ms: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
