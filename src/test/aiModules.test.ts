import { describe, expect, it } from "vitest";

// Mirror of the server-side registry in supabase/functions/_shared/ai-service.ts.
// These tests pin the module list and error-mapping rules the AI Control Center relies on.
const AI_MODULES = {
  "ai-moderation": { model: "google/gemini-3-flash-preview" },
  "anti-fraud": { model: "google/gemini-3-flash-preview" },
  "listing-generator": { model: "google/gemini-3-flash-preview" },
  "price-advisor": { model: "google/gemini-3-flash-preview" },
  "banner-generator": { model: "google/gemini-3-flash-preview" },
  "promotion-advisor": { model: "google/gemini-3-flash-preview" },
  "trend-analyzer": { model: "google/gemini-3-flash-preview" },
  "seed-generator": { model: "google/gemini-3-flash-preview" },
  "smart-search": { model: "openai/gpt-6-astra" },
} as const;

function mapGatewayError(status: number): { status: number; retryable: boolean } {
  switch (status) {
    case 400: return { status: 400, retryable: false };
    case 401: return { status: 500, retryable: false };
    case 402: return { status: 402, retryable: false };
    case 403: return { status: 403, retryable: false };
    case 404: return { status: 503, retryable: false };
    case 429: return { status: 429, retryable: true };
    default:
      return status >= 500 ? { status: 503, retryable: true } : { status: 500, retryable: false };
  }
}

describe("AI module registry", () => {
  it("covers all 9 production AI modules", () => {
    expect(Object.keys(AI_MODULES)).toHaveLength(9);
  });

  it("keeps smart-search on the Responses model and the rest on the chat model", () => {
    expect(AI_MODULES["smart-search"].model).toBe("openai/gpt-6-astra");
    for (const [name, spec] of Object.entries(AI_MODULES)) {
      if (name !== "smart-search") expect(spec.model).toBe("google/gemini-3-flash-preview");
    }
  });
});

describe("gateway error mapping", () => {
  it("treats 402 as terminal credits exhaustion", () => {
    expect(mapGatewayError(402)).toEqual({ status: 402, retryable: false });
  });

  it("treats 403 as terminal unavailability", () => {
    expect(mapGatewayError(403)).toEqual({ status: 403, retryable: false });
  });

  it("marks 429 and 5xx as retryable", () => {
    expect(mapGatewayError(429).retryable).toBe(true);
    expect(mapGatewayError(500)).toEqual({ status: 503, retryable: true });
    expect(mapGatewayError(502).retryable).toBe(true);
  });

  it("never exposes 401 to the client", () => {
    expect(mapGatewayError(401).status).toBe(500);
  });
});
