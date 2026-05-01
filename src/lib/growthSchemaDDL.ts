/**
 * Полный DDL Growth Engine: enums, таблицы, RLS, security definer функции.
 * Используется для экспорта схемы при миграции в собственный Supabase проект.
 *
 * ВАЖНО: при изменении схемы в supabase/migrations/* — синхронизируй этот файл.
 */
export const GROWTH_SCHEMA_DDL = `-- =====================================================================
-- Growth Engine — schema export
-- Применять в Supabase SQL Editor одной транзакцией.
-- =====================================================================

-- 1) ENUMS ------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.recommendation_type AS ENUM (
    'city_launch', 'category_growth', 'ad_placement', 'pricing',
    'reactivation', 'seed_category'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.recommendation_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.import_job_status AS ENUM ('pending', 'running', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.import_source AS ENUM ('csv', 'ai', 'api', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_channel AS ENUM ('email', 'push', 'sms', 'in_app');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.referral_status AS ENUM ('pending', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.bonus_status AS ENUM ('available', 'used', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.bonus_type AS ENUM ('vip', 'top', 'urgent', 'up', 'credits');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) SECURITY DEFINER FUNCTIONS --------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

-- 3) TABLES ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.growth_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  city text NOT NULL DEFAULT 'neftyugansk',
  total_users integer NOT NULL DEFAULT 0,
  new_users integer NOT NULL DEFAULT 0,
  active_users integer NOT NULL DEFAULT 0,
  total_listings integer NOT NULL DEFAULT 0,
  new_listings integer NOT NULL DEFAULT 0,
  active_listings integer NOT NULL DEFAULT 0,
  total_views integer NOT NULL DEFAULT 0,
  total_contacts integer NOT NULL DEFAULT 0,
  revenue_kopecks bigint NOT NULL DEFAULT 0,
  vip_purchases integer NOT NULL DEFAULT 0,
  top_purchases integer NOT NULL DEFAULT 0,
  up_purchases integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.growth_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.recommendation_type NOT NULL,
  priority public.recommendation_priority NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  action_data jsonb DEFAULT '{}'::jsonb,
  is_applied boolean NOT NULL DEFAULT false,
  is_dismissed boolean NOT NULL DEFAULT false,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seed_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title_pattern text NOT NULL,
  description_pattern text NOT NULL,
  price_min integer,
  price_max integer,
  attributes jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source public.import_source NOT NULL,
  status public.import_job_status NOT NULL DEFAULT 'pending',
  city text DEFAULT 'neftyugansk',
  category text,
  total_rows integer NOT NULL DEFAULT 0,
  processed_rows integer NOT NULL DEFAULT 0,
  failed_rows integer NOT NULL DEFAULT 0,
  payload jsonb DEFAULT '{}'::jsonb,
  error_log jsonb DEFAULT '[]'::jsonb,
  created_by uuid,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  channel public.notification_channel NOT NULL,
  status public.notification_status NOT NULL DEFAULT 'pending',
  template text NOT NULL,
  subject text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_id uuid,
  referral_code text NOT NULL,
  status public.referral_status NOT NULL DEFAULT 'pending',
  reward_type text,
  rewarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bonus_type public.bonus_type NOT NULL,
  status public.bonus_status NOT NULL DEFAULT 'available',
  source text,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) ENABLE RLS ------------------------------------------------------
ALTER TABLE public.user_roles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_metrics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_recommendations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seed_templates          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_queue     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bonuses            ENABLE ROW LEVEL SECURITY;

-- 5) RLS POLICIES ----------------------------------------------------

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;
CREATE POLICY "Super admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- growth_metrics
DROP POLICY IF EXISTS "Admins can view growth metrics" ON public.growth_metrics;
CREATE POLICY "Admins can view growth metrics" ON public.growth_metrics
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert growth metrics" ON public.growth_metrics;
CREATE POLICY "Admins can insert growth metrics" ON public.growth_metrics
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update growth metrics" ON public.growth_metrics;
CREATE POLICY "Admins can update growth metrics" ON public.growth_metrics
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- growth_recommendations
DROP POLICY IF EXISTS "Admins manage recommendations" ON public.growth_recommendations;
CREATE POLICY "Admins manage recommendations" ON public.growth_recommendations
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- seed_templates
DROP POLICY IF EXISTS "Admins manage seed templates" ON public.seed_templates;
CREATE POLICY "Admins manage seed templates" ON public.seed_templates
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- import_jobs
DROP POLICY IF EXISTS "Admins manage import jobs" ON public.import_jobs;
CREATE POLICY "Admins manage import jobs" ON public.import_jobs
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- notifications_queue
DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications_queue;
CREATE POLICY "Admins manage notifications" ON public.notifications_queue
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users see their in-app notifications" ON public.notifications_queue;
CREATE POLICY "Users see their in-app notifications" ON public.notifications_queue
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND channel = 'in_app');

-- referrals
DROP POLICY IF EXISTS "Users see their own referrals" ON public.referrals;
CREATE POLICY "Users see their own referrals" ON public.referrals
  FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can create referrals" ON public.referrals;
CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Admins can manage referrals" ON public.referrals;
CREATE POLICY "Admins can manage referrals" ON public.referrals
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- user_bonuses
DROP POLICY IF EXISTS "Users see their own bonuses" ON public.user_bonuses;
CREATE POLICY "Users see their own bonuses" ON public.user_bonuses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage bonuses" ON public.user_bonuses;
CREATE POLICY "Admins manage bonuses" ON public.user_bonuses
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 6) INDEXES ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_growth_metrics_date ON public.growth_metrics (snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_growth_recs_active  ON public.growth_recommendations (is_applied, is_dismissed, priority);
CREATE INDEX IF NOT EXISTS idx_seed_templates_cat  ON public.seed_templates (category) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_import_jobs_status  ON public.import_jobs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_queue_pending ON public.notifications_queue (status, scheduled_at) WHERE status = 'pending';

-- =====================================================================
-- END
-- =====================================================================
`;
