import { supabase } from "@/integrations/supabase/client";

export const LISTING_PHOTOS_BUCKET = "listing-photos";
export const MAX_PHOTOS = 10;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const SIGNED_TTL = 60 * 60 * 24; // 24h

/** Stored paths look like "<userId>/<file>"; full URLs / local assets pass through unchanged. */
export const isStoragePath = (p: string) => !!p && !/^(https?:|\/|data:|blob:)/.test(p);

export async function uploadListingPhoto(userId: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Можно загружать только изображения");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Фото больше 10 МБ");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(LISTING_PHOTOS_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  return path;
}

export async function deleteListingPhoto(path: string) {
  await supabase.storage.from(LISTING_PHOTOS_BUCKET).remove([path]);
}

/** Batch-resolve storage paths to viewable URLs in one request. */
export async function resolvePhotoUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(isStoragePath))];
  if (!unique.length) return {};
  const { data } = await supabase.storage.from(LISTING_PHOTOS_BUCKET).createSignedUrls(unique, SIGNED_TTL);
  const map: Record<string, string> = {};
  for (const d of data ?? []) if (d.path && d.signedUrl) map[d.path] = d.signedUrl;
  return map;
}
