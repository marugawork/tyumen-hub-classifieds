ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS subcategory_id text,
  ADD COLUMN IF NOT EXISTS condition text,
  ADD COLUMN IF NOT EXISTS car_brand text,
  ADD COLUMN IF NOT EXISTS car_model text,
  ADD COLUMN IF NOT EXISTS car_year integer,
  ADD COLUMN IF NOT EXISTS car_mileage integer,
  ADD COLUMN IF NOT EXISTS car_body text,
  ADD COLUMN IF NOT EXISTS car_transmission text,
  ADD COLUMN IF NOT EXISTS car_engine text,
  ADD COLUMN IF NOT EXISTS car_drive text;
ALTER TABLE public.listings
  ADD CONSTRAINT listings_condition_chk CHECK (condition IS NULL OR condition IN ('new','used')),
  ADD CONSTRAINT listings_car_year_chk CHECK (car_year IS NULL OR car_year BETWEEN 1900 AND 2100),
  ADD CONSTRAINT listings_car_mileage_chk CHECK (car_mileage IS NULL OR car_mileage BETWEEN 0 AND 5000000),
  ADD CONSTRAINT listings_car_text_len_chk CHECK (coalesce(length(car_brand),0) <= 60 AND coalesce(length(car_model),0) <= 80);
CREATE INDEX IF NOT EXISTS listings_car_idx ON public.listings (subcategory_id, car_brand, car_model) WHERE status = 'active';