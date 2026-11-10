
- AI model calls live in Supabase Edge Functions via Lovable AI Gateway (Responses API); the browser sends compact candidate lists, never the key — keeps credentials server-side.
- Edge functions that call AI go through the shared layer `supabase/functions/_shared/ai-service.ts` (module registry, error mapping, usage logging to `ai_usage_log`); module enable/limits are managed in `ai_module_config` via the super_admin-only `ai-control` function — no per-function provider duplication.
- Automotive fields and selectors share one dictionary; automobile feeds query active Cloud listings server-side with bounded pages and no demo fallback, so filters reflect stored facts.
