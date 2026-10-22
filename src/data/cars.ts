// Starter car dictionary (brand → models). Structure follows drom.ru (марка → модель);
// this is NOT a full copy of the Drom catalog. "Другая" lets sellers type their own value.

export const OTHER = "Другая";

export const carBrands: Record<string, string[]> = {
  "Лада": ["Granta", "Vesta", "Largus", "Niva Legend", "Niva Travel", "XRAY", "Kalina", "Priora", "2114", "2107"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Land Cruiser", "Land Cruiser Prado", "Highlander", "Prius", "Vitz", "Mark II", "Hilux"],
  "Nissan": ["Almera", "Qashqai", "X-Trail", "Juke", "Note", "Teana", "Terrano", "Murano", "Patrol", "Tiida"],
  "Honda": ["Civic", "Accord", "CR-V", "Fit", "Freed", "Stepwgn", "HR-V", "Vezel", "Pilot"],
  "Hyundai": ["Solaris", "Creta", "Tucson", "Santa Fe", "Elantra", "Sonata", "i30", "Accent", "Getz"],
  "Kia": ["Rio", "Ceed", "Sportage", "Sorento", "Optima", "K5", "Seltos", "Soul", "Cerato", "Picanto"],
  "Volkswagen": ["Polo", "Golf", "Passat", "Jetta", "Tiguan", "Touareg", "Teramont"],
  "Renault": ["Logan", "Sandero", "Duster", "Kaptur", "Arkana", "Megane", "Fluence"],
  "Skoda": ["Octavia", "Rapid", "Kodiaq", "Karoq", "Superb", "Fabia", "Yeti"],
  "BMW": ["1 серия", "3 серия", "5 серия", "7 серия", "X1", "X3", "X5", "X6"],
  "Mercedes-Benz": ["A-класс", "C-класс", "E-класс", "S-класс", "GLA", "GLC", "GLE", "G-класс"],
  "Mitsubishi": ["Lancer", "Outlander", "ASX", "Pajero", "Pajero Sport", "L200"],
  "Mazda": ["3", "6", "CX-5", "CX-7", "CX-9", "Demio"],
  "Ford": ["Focus", "Mondeo", "Kuga", "Explorer", "Fiesta", "EcoSport"],
  "Chevrolet": ["Niva", "Cruze", "Lacetti", "Aveo", "Cobalt", "Captiva", "Spark"],
  "Geely": ["Coolray", "Atlas", "Atlas Pro", "Monjaro", "Tugella", "Emgrand"],
  "Chery": ["Tiggo 4", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Arrizo 8"],
  "Haval": ["Jolion", "F7", "F7x", "H6", "Dargo", "H9"],
};

export const brandNames = Object.keys(carBrands);

export const bodyTypes = ["Седан", "Хэтчбек", "Универсал", "Внедорожник", "Кроссовер", "Минивэн", "Купе", "Пикап", "Лифтбек", "Кабриолет", "Фургон"];
export const transmissions = ["Механика", "Автомат", "Робот", "Вариатор"];
export const engines = ["Бензин", "Дизель", "Гибрид", "Электро", "Газ"];
export const drives = ["Передний", "Задний", "Полный"];

export function modelsFor(brand?: string): string[] {
  return brand ? carBrands[brand] ?? [] : [];
}

/** Changing brand keeps the model only if it belongs to the new brand. */
export function compatibleModel(brand: string | undefined, model: string | undefined): string | undefined {
  if (!brand || !model) return undefined;
  return modelsFor(brand).includes(model) ? model : undefined;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  condition?: "new" | "used";
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  body?: string;
  transmission?: string;
  engine?: string;
  drive?: string;
}

export interface CarSpecs {
  car_brand?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  car_mileage?: number | null;
  car_body?: string | null;
  car_transmission?: string | null;
  car_engine?: string | null;
  car_drive?: string | null;
  condition?: string | null;
}

/** Pure client-side check mirroring the server query; listings without a value don't match an active filter. */
export function matchesCarFilters(l: CarSpecs, f: CarFilters): boolean {
  if (f.brand && l.car_brand !== f.brand) return false;
  if (f.model && l.car_model !== f.model) return false;
  if (f.condition && l.condition !== f.condition) return false;
  if (f.yearMin != null && (l.car_year == null || l.car_year < f.yearMin)) return false;
  if (f.yearMax != null && (l.car_year == null || l.car_year > f.yearMax)) return false;
  if (f.mileageMax != null && (l.car_mileage == null || l.car_mileage > f.mileageMax)) return false;
  if (f.body && l.car_body !== f.body) return false;
  if (f.transmission && l.car_transmission !== f.transmission) return false;
  if (f.engine && l.car_engine !== f.engine) return false;
  if (f.drive && l.car_drive !== f.drive) return false;
  return true;
}

const CURRENT_YEAR = new Date().getFullYear();

/** Returns an error message or null. */
export function validateCar(c: { brand: string; model: string; year: string; mileage: string; condition: "new" | "used" }): string | null {
  if (!c.brand.trim()) return "Укажите марку";
  if (!c.model.trim()) return "Укажите модель";
  if (c.brand.length > 60 || c.model.length > 80) return "Слишком длинное название";
  const y = Number(c.year);
  if (!c.year || !Number.isInteger(y) || y < 1900 || y > CURRENT_YEAR + 1) return "Укажите корректный год выпуска";
  if (c.condition === "used") {
    const m = Number(c.mileage);
    if (c.mileage === "" || !Number.isInteger(m) || m < 0 || m > 5_000_000) return "Укажите пробег";
  }
  return null;
}

const URL_KEYS: (keyof CarFilters)[] = ["brand", "model", "condition", "yearMin", "yearMax", "mileageMax", "body", "transmission", "engine", "drive"];
const NUM_KEYS = new Set(["yearMin", "yearMax", "mileageMax"]);

export function carFiltersFromParams(p: URLSearchParams): CarFilters {
  const f: Record<string, unknown> = {};
  for (const k of URL_KEYS) {
    const v = p.get(k);
    if (!v) continue;
    if (NUM_KEYS.has(k)) { const n = Number(v); if (Number.isFinite(n)) f[k] = n; }
    else if (k === "condition") { if (v === "new" || v === "used") f[k] = v; }
    else f[k] = v;
  }
  const out = f as CarFilters;
  out.model = compatibleModel(out.brand, out.model);
  return out;
}

export function writeCarFilters(p: URLSearchParams, f: CarFilters): URLSearchParams {
  const next = new URLSearchParams(p);
  for (const k of URL_KEYS) {
    const v = f[k];
    if (v === undefined || v === "" || v === null) next.delete(k);
    else next.set(k, String(v));
  }
  return next;
}
