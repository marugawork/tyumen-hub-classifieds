CREATE TABLE public.ai_usage_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  model text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  duration_ms integer,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_usage_log TO authenticated;
GRANT ALL ON public.ai_usage_log TO service_role;
ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view AI usage log" ON public.ai_usage_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE TABLE public.ai_module_config (
  module text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  model text NOT NULL,
  daily_limit integer NOT NULL DEFAULT 1000,
  description text NOT NULL DEFAULT '',
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_module_config TO authenticated;
GRANT ALL ON public.ai_module_config TO service_role;
ALTER TABLE public.ai_module_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view AI module config" ON public.ai_module_config FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "Admins can update AI module config" ON public.ai_module_config FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE INDEX idx_ai_usage_log_module_created ON public.ai_usage_log (module, created_at DESC);
CREATE INDEX idx_ai_usage_log_created ON public.ai_usage_log (created_at DESC);