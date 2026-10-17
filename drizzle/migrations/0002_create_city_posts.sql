CREATE TABLE public.city_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid,
  type text NOT NULL DEFAULT 'news',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  event_date timestamptz,
  district text,
  city text NOT NULL DEFAULT 'nefteyugansk',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.city_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.city_posts TO authenticated;
GRANT ALL ON public.city_posts TO service_role;

ALTER TABLE public.city_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published city posts are public"
ON public.city_posts FOR SELECT
USING (status = 'published' OR auth.uid() = author_id OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can submit city posts"
ON public.city_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and admins can update city posts"
ON public.city_posts FOR UPDATE TO authenticated
USING (auth.uid() = author_id OR is_admin(auth.uid()))
WITH CHECK (auth.uid() = author_id OR is_admin(auth.uid()));

CREATE POLICY "Authors and admins can delete city posts"
ON public.city_posts FOR DELETE TO authenticated
USING (auth.uid() = author_id OR is_admin(auth.uid()));

CREATE TRIGGER trg_city_posts_updated_at
BEFORE UPDATE ON public.city_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_city_posts_status_date ON public.city_posts (status, created_at DESC);
CREATE INDEX idx_city_posts_type ON public.city_posts (type, status);