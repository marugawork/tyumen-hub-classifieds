-- Composite index for the main public feed query pattern:
-- WHERE status='active' [AND city=?] [AND district=?] ORDER BY vip DESC, created_at DESC
CREATE INDEX IF NOT EXISTS idx_listings_feed
  ON public.listings (status, city, vip DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_status_category_created
  ON public.listings (status, category_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_status_district_created
  ON public.listings (status, district, created_at DESC);

-- Help moderation queue filters
CREATE INDEX IF NOT EXISTS idx_mod_queue_status_created
  ON public.moderation_queue (status, created_at DESC);