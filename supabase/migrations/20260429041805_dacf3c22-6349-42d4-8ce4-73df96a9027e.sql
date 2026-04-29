-- ============================================
-- USER ROLES SYSTEM
-- ============================================

CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- GROWTH METRICS (daily snapshots per city)
-- ============================================

CREATE TABLE public.growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  city TEXT NOT NULL DEFAULT 'neftyugansk',
  total_users INTEGER NOT NULL DEFAULT 0,
  new_users INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  total_listings INTEGER NOT NULL DEFAULT 0,
  new_listings INTEGER NOT NULL DEFAULT 0,
  active_listings INTEGER NOT NULL DEFAULT 0,
  revenue_kopecks BIGINT NOT NULL DEFAULT 0,
  vip_purchases INTEGER NOT NULL DEFAULT 0,
  top_purchases INTEGER NOT NULL DEFAULT 0,
  up_purchases INTEGER NOT NULL DEFAULT 0,
  total_views INTEGER NOT NULL DEFAULT 0,
  total_contacts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (snapshot_date, city)
);

ALTER TABLE public.growth_metrics ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_growth_metrics_date ON public.growth_metrics (snapshot_date DESC);
CREATE INDEX idx_growth_metrics_city ON public.growth_metrics (city);

CREATE POLICY "Admins can view growth metrics"
ON public.growth_metrics FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert growth metrics"
ON public.growth_metrics FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update growth metrics"
ON public.growth_metrics FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================
-- REFERRALS
-- ============================================

CREATE TYPE public.referral_status AS ENUM ('pending', 'qualified', 'rewarded', 'expired');

CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status referral_status NOT NULL DEFAULT 'pending',
  reward_type TEXT,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_referrals_referrer ON public.referrals (referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals (referral_code);

CREATE POLICY "Users see their own referrals"
ON public.referrals FOR SELECT
TO authenticated
USING (auth.uid() = referrer_id OR auth.uid() = referred_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create referrals"
ON public.referrals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can manage referrals"
ON public.referrals FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- ============================================
-- USER BONUSES
-- ============================================

CREATE TYPE public.bonus_type AS ENUM ('free_vip', 'free_top', 'free_up', 'free_urgent', 'signup_bonus', 'referral_bonus');
CREATE TYPE public.bonus_status AS ENUM ('available', 'used', 'expired');

CREATE TABLE public.user_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bonus_type bonus_type NOT NULL,
  status bonus_status NOT NULL DEFAULT 'available',
  source TEXT,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_user_bonuses_user ON public.user_bonuses (user_id);

CREATE POLICY "Users see their own bonuses"
ON public.user_bonuses FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage bonuses"
ON public.user_bonuses FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- NOTIFICATIONS QUEUE
-- ============================================

CREATE TYPE public.notification_channel AS ENUM ('email', 'push', 'in_app');
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');

CREATE TABLE public.notifications_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  status notification_status NOT NULL DEFAULT 'pending',
  template TEXT NOT NULL,
  subject TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications_queue ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_notifications_status ON public.notifications_queue (status, scheduled_at);
CREATE INDEX idx_notifications_user ON public.notifications_queue (user_id);

CREATE POLICY "Admins manage notifications"
ON public.notifications_queue FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users see their in-app notifications"
ON public.notifications_queue FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND channel = 'in_app');

-- ============================================
-- SEED TEMPLATES
-- ============================================

CREATE TABLE public.seed_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title_pattern TEXT NOT NULL,
  description_pattern TEXT NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  attributes JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seed_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage seed templates"
ON public.seed_templates FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- IMPORT JOBS
-- ============================================

CREATE TYPE public.import_job_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE public.import_source AS ENUM ('csv', 'api', 'manual', 'ai_generated');

CREATE TABLE public.import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source import_source NOT NULL,
  status import_job_status NOT NULL DEFAULT 'pending',
  total_rows INTEGER NOT NULL DEFAULT 0,
  processed_rows INTEGER NOT NULL DEFAULT 0,
  failed_rows INTEGER NOT NULL DEFAULT 0,
  city TEXT DEFAULT 'neftyugansk',
  category TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  error_log JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_import_jobs_status ON public.import_jobs (status);

CREATE POLICY "Admins manage import jobs"
ON public.import_jobs FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- GROWTH RECOMMENDATIONS (AI advice for admin)
-- ============================================

CREATE TYPE public.recommendation_type AS ENUM ('city_launch', 'category_growth', 'ad_placement', 'pricing', 'reactivation', 'other');
CREATE TYPE public.recommendation_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE public.growth_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type recommendation_type NOT NULL,
  priority recommendation_priority NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.growth_recommendations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_recs_priority ON public.growth_recommendations (priority, is_dismissed);

CREATE POLICY "Admins manage recommendations"
ON public.growth_recommendations FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));