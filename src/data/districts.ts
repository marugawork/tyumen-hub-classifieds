export const districts = [
  "1 мкр",
  "2 мкр",
  "3 мкр",
  "4 мкр",
  "5 мкр",
  "6 мкр",
  "7 мкр",
  "8 мкр",
  "9 мкр",
  "10 мкр",
  "11 мкр",
  "12 мкр",
  "13 мкр",
  "14 мкр",
  "15 мкр",
  "16 мкр",
  "Центр",
  "Промзона",
  "Окраина",
] as const;

export type District = typeof districts[number];

/** Convert district name to URL slug: "14 мкр" → "14-mkr", "Центр" → "centr" */
export function districtToSlug(district: string): string {
  const map: Record<string, string> = {
    "Центр": "centr",
    "Промзона": "promzona",
    "Окраина": "okraina",
  };
  if (map[district]) return map[district];
  // "14 мкр" → "14-mkr"
  const match = district.match(/^(\d+)\s*мкр$/);
  if (match) return `${match[1]}-mkr`;
  return district.toLowerCase().replace(/\s+/g, "-");
}

/** Convert URL slug back to district name: "14-mkr" → "14 мкр" */
export function slugToDistrict(slug: string): string | undefined {
  const map: Record<string, string> = {
    "centr": "Центр",
    "promzona": "Промзона",
    "okraina": "Окраина",
  };
  if (map[slug]) return map[slug];
  const match = slug.match(/^(\d+)-mkr$/);
  if (match) {
    const name = `${match[1]} мкр`;
    return districts.includes(name as any) ? name : undefined;
  }
  return undefined;
}
