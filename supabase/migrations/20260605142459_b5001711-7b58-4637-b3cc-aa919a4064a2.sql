
-- updated_at helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========================
-- LISTINGS
-- =========================
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '',
  author_type TEXT NOT NULL DEFAULT 'private',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'RUB',
  category_id TEXT NOT NULL,
  district TEXT,
  city TEXT NOT NULL DEFAULT 'nefteyugansk',
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  phone TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  vip BOOLEAN NOT NULL DEFAULT false,
  promotion_type TEXT,
  promotion_expires_at TIMESTAMPTZ,
  urgent BOOLEAN NOT NULL DEFAULT false,
  pinned BOOLEAN NOT NULL DEFAULT false,
  moderation_score INTEGER,
  risk_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are public"
  ON public.listings FOR SELECT
  USING (status = 'active' OR auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can delete their own listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id OR public.is_admin(auth.uid()));

CREATE TRIGGER trg_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_listings_category ON public.listings(category_id);
CREATE INDEX idx_listings_district ON public.listings(district);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX idx_listings_author ON public.listings(author_id);

-- =========================
-- BUSINESS PROFILES
-- =========================
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC NOT NULL DEFAULT 0,
  deals_count INTEGER NOT NULL DEFAULT 0,
  founded_year INTEGER,
  city TEXT NOT NULL DEFAULT 'nefteyugansk',
  district TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.business_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_profiles TO authenticated;
GRANT ALL ON public.business_profiles TO service_role;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business profiles are public"
  ON public.business_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users manage own business profile"
  ON public.business_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TRIGGER trg_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- MODERATION QUEUE
-- =========================
CREATE TABLE public.moderation_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  ai_score INTEGER,
  ai_risk TEXT,
  ai_reasons TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.moderation_queue TO authenticated;
GRANT ALL ON public.moderation_queue TO service_role;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage moderation queue"
  ON public.moderation_queue FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER trg_moderation_queue_updated_at
  BEFORE UPDATE ON public.moderation_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_mod_queue_status ON public.moderation_queue(status);
CREATE INDEX idx_mod_queue_listing ON public.moderation_queue(listing_id);

-- =========================
-- FRAUD FLAGS
-- =========================
CREATE TABLE public.fraud_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  flag_group TEXT NOT NULL DEFAULT 'other',
  fraud_score INTEGER NOT NULL DEFAULT 0,
  reasons TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fraud_flags TO authenticated;
GRANT ALL ON public.fraud_flags TO service_role;
ALTER TABLE public.fraud_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage fraud flags"
  ON public.fraud_flags FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER trg_fraud_flags_updated_at
  BEFORE UPDATE ON public.fraud_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_fraud_flags_listing ON public.fraud_flags(listing_id);
CREATE INDEX idx_fraud_flags_resolved ON public.fraud_flags(resolved);
