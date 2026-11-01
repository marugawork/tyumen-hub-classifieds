// Data access layer for listings — DB-first with static fallback.
// Allows gradual migration from `src/data/listings.ts` to Supabase tables
// without breaking the public site while DB is still empty.

import { supabase } from "@/integrations/supabase/client";
import { listings as staticListings } from "@/data/listings";
import type { Listing } from "@/data/listings";
import { resolvePhotoUrls, isStoragePath } from "@/lib/listingPhotos";
import type { CarSpecs, CarFilters } from "@/data/cars";

export interface DbListing extends CarSpecs {
  subcategory_id?: string | null;
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  district: string | null;
  city: string;
  photos: string[];
  phone: string | null;
  author_id: string | null;
  author_name: string;
  author_type: string;
  views: number;
  status: string;
  vip: boolean;
  promotion_type: string | null;
  urgent: boolean;
  pinned: boolean;
  created_at: string;
}

function dbToListing(r: DbListing): Listing {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    price: Number(r.price) || 0,
    currency: r.currency || "RUB",
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id || "",
    car_brand: r.car_brand, car_model: r.car_model, car_year: r.car_year, car_mileage: r.car_mileage,
    car_body: r.car_body, car_transmission: r.car_transmission, car_engine: r.car_engine, car_drive: r.car_drive,
    district: r.district || "",
    address: "",
    photos: r.photos?.length ? r.photos : ["/placeholder.svg"],
    authorName: r.author_name || "Продавец",
    authorType: (r.author_type === "business" ? "business" : "private") as Listing["authorType"],
    authorPhone: r.phone || "",
    createdAt: r.created_at,
    views: r.views ?? 0,
    favorites: 0,
    vip: !!r.vip,
    promoted: r.promotion_type === "top" || r.promotion_type === "up",
    promotion_type: (r.promotion_type as Listing["promotion_type"]) ?? null,
    flags: {
      urgent: !!r.urgent,
      bargain: false,
      delivery: false,
    },
    condition: r.condition === "new" ? "new" : "used",
  };

}

export interface FetchListingsParams {
  categoryId?: string;
  district?: string;
  city?: string;
  limit?: number;
}

/**
 * Fetch active listings from DB. Falls back to static seed data when DB is empty
 * (e.g. fresh install) so the public site is never blank.
 */
export async function fetchListings(params: FetchListingsParams = {}): Promise<Listing[]> {
  try {
    let q = supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("vip", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(params.limit ?? 100);

    if (params.categoryId) q = q.eq("category_id", params.categoryId);
    if (params.district) q = q.eq("district", params.district);
    if (params.city) q = q.eq("city", params.city);

    const { data, error } = await q;
    if (error) throw error;

    const rows = (data ?? []) as unknown as DbListing[];
    if (rows.length === 0) return filterStatic(params);
    const urls = await resolvePhotoUrls(rows.flatMap(r => r.photos ?? []));
    return rows.map(r => dbToListing({
      ...r,
      photos: (r.photos ?? []).map(ph => (isStoragePath(ph) ? urls[ph] : ph)).filter(Boolean) as string[],
    }));
  } catch {
    return filterStatic(params);
  }
}

function filterStatic(p: FetchListingsParams): Listing[] {
  let list = staticListings;
  if (p.categoryId) list = list.filter(l => l.categoryId === p.categoryId);
  if (p.district) list = list.filter(l => l.district === p.district);
  return p.limit ? list.slice(0, p.limit) : list;
}

async function resolveListings(rows: DbListing[]): Promise<Listing[]> {
  const urls = await resolvePhotoUrls(rows.flatMap(r => r.photos ?? []));
  return rows.map(r => dbToListing({ ...r, photos: (r.photos ?? []).map(p => isStoragePath(p) ? urls[p] : p).filter((p): p is string => Boolean(p)) }));
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const result = await resolveListings([data as DbListing]);
  return result[0] ?? null;
}

export interface CarQuery extends CarFilters { district?: string; priceMin?: number; priceMax?: number; sortBy?: string }
export const CAR_PAGE_SIZE = 24;
export async function fetchCarPage(f: CarQuery, page: number) {
  let q = supabase.from("listings").select("*", { count: "exact" }).eq("status", "active").eq("category_id", "transport").eq("subcategory_id", "auto");
  if (f.district) q = q.eq("district", f.district);
  if (f.brand) q = q.eq("car_brand", f.brand);
  if (f.model) q = q.eq("car_model", f.model);
  if (f.condition) q = q.eq("condition", f.condition);
  if (f.yearMin != null) q = q.gte("car_year", f.yearMin);
  if (f.yearMax != null) q = q.lte("car_year", f.yearMax);
  if (f.mileageMax != null) q = q.lte("car_mileage", f.mileageMax);
  if (f.priceMin != null) q = q.gte("price", f.priceMin);
  if (f.priceMax != null) q = q.lte("price", f.priceMax);
  if (f.body) q = q.eq("car_body", f.body);
  if (f.transmission) q = q.eq("car_transmission", f.transmission);
  if (f.engine) q = q.eq("car_engine", f.engine);
  if (f.drive) q = q.eq("car_drive", f.drive);
  if (f.sortBy === "price_asc" || f.sortBy === "price_desc") q = q.order("price", { ascending: f.sortBy === "price_asc" });
  else if (f.sortBy === "popular") q = q.order("views", { ascending: false });
  else q = q.order("created_at", { ascending: false });
  const { data, error, count } = await q.order("id", { ascending: false }).range(page * CAR_PAGE_SIZE, (page + 1) * CAR_PAGE_SIZE - 1);
  if (error) throw error;
  return { listings: await resolveListings((data ?? []) as DbListing[]), total: count ?? 0 };
}
