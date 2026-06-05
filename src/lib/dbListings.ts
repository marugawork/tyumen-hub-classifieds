// Data access layer for listings — DB-first with static fallback.
// Allows gradual migration from `src/data/listings.ts` to Supabase tables
// without breaking the public site while DB is still empty.

import { supabase } from "@/integrations/supabase/client";
import { listings as staticListings } from "@/data/listings";
import type { Listing } from "@/data/listings";

export interface DbListing {
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
    subcategoryId: "",
    district: r.district || "",
    address: "",
    photos: r.photos?.length ? r.photos : ["/placeholder.svg"],
    authorName: r.author_name || "Продавец",
    authorType: (r.author_type === "business" ? "business" : "private") as Listing["authorType"],
    authorPhone: r.phone || "",
    authorRating: 5,
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
    condition: "used",
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
    return rows.map(dbToListing);
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
