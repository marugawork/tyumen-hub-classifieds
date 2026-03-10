import { listings } from "./listings";
import { categories } from "./categories";
import { districts } from "./districts";

// ── KPI data ──
export function getKpiData() {
  const total = listings.length;
  const active = listings.filter((l) => !l.flags.urgent).length;
  const vip = listings.filter((l) => l.vip).length;
  const top = listings.filter((l) => l.promotion_type === "top").length;
  return {
    totalListings: total,
    activeListings: active,
    onModeration: 12,
    vipListings: vip,
    topListings: top,
    deletedListings: 3,
    totalUsers: 1284,
    newUsersToday: 8,
    businessAccounts: 24,
    complaintsToday: 5,
    activeCampaigns: 3,
    activeBanners: 7,
    adRevenue: 34500,
    promoRevenue: 52950,
    revenueDay: 12400,
    revenueWeek: 87450,
    revenueMonth: 348200,
  };
}

// ── Chart data ──
export const listingsPerDay = [
  { date: "01.03", count: 12 }, { date: "02.03", count: 18 }, { date: "03.03", count: 9 },
  { date: "04.03", count: 22 }, { date: "05.03", count: 15 }, { date: "06.03", count: 27 },
  { date: "07.03", count: 20 }, { date: "08.03", count: 8 }, { date: "09.03", count: 31 },
  { date: "10.03", count: 25 },
];

export const usersPerDay = [
  { date: "01.03", count: 5 }, { date: "02.03", count: 8 }, { date: "03.03", count: 3 },
  { date: "04.03", count: 12 }, { date: "05.03", count: 7 }, { date: "06.03", count: 9 },
  { date: "07.03", count: 6 }, { date: "08.03", count: 4 }, { date: "09.03", count: 11 },
  { date: "10.03", count: 8 },
];

export const revenuePerDay = [
  { date: "01.03", banners: 4500, vip: 2990, top: 1990, raise: 990 },
  { date: "02.03", banners: 3200, vip: 5980, top: 990, raise: 1980 },
  { date: "03.03", banners: 5100, vip: 2990, top: 1990, raise: 495 },
  { date: "04.03", banners: 6800, vip: 8970, top: 3980, raise: 2475 },
  { date: "05.03", banners: 4200, vip: 5980, top: 1990, raise: 990 },
  { date: "06.03", banners: 7500, vip: 2990, top: 990, raise: 1485 },
  { date: "07.03", banners: 3800, vip: 5980, top: 1990, raise: 990 },
];

export const categoryStats = categories.slice(0, 10).map((c) => ({
  name: c.name,
  count: Math.floor(Math.random() * 80) + 10,
}));

export const districtStats = districts.slice(0, 10).map((d) => ({
  name: d,
  count: Math.floor(Math.random() * 60) + 5,
}));

// ── Users mock ──
export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "private" | "business";
  registeredAt: string;
  listingsCount: number;
  complaints: number;
  status: "active" | "blocked";
}

export const mockUsers: MockUser[] = [
  { id: "u1", name: "Алексей Петров", email: "alex@mail.ru", phone: "+7 912 425-11-22", type: "private", registeredAt: "2025-08-12", listingsCount: 7, complaints: 0, status: "active" },
  { id: "u2", name: "Мария Сидорова", email: "maria@yandex.ru", phone: "+7 982 500-33-44", type: "private", registeredAt: "2025-09-05", listingsCount: 3, complaints: 1, status: "active" },
  { id: "u3", name: "ЮганскАвто", email: "auto@yugansk.ru", phone: "+7 3463 22-55-66", type: "business", registeredAt: "2025-06-20", listingsCount: 24, complaints: 0, status: "active" },
  { id: "u4", name: "Дмитрий Козлов", email: "dima@gmail.com", phone: "+7 922 400-77-88", type: "private", registeredAt: "2025-10-15", listingsCount: 1, complaints: 3, status: "blocked" },
  { id: "u5", name: "ТехноСервис", email: "techno@nyu.ru", phone: "+7 3463 25-99-00", type: "business", registeredAt: "2025-07-01", listingsCount: 18, complaints: 0, status: "active" },
  { id: "u6", name: "Елена Васильева", email: "elena@inbox.ru", phone: "+7 912 425-22-33", type: "private", registeredAt: "2025-11-20", listingsCount: 5, complaints: 0, status: "active" },
  { id: "u7", name: "НефтеСтрой", email: "neftestroy@bk.ru", phone: "+7 3463 22-44-55", type: "business", registeredAt: "2025-05-10", listingsCount: 31, complaints: 1, status: "active" },
  { id: "u8", name: "Сергей Иванов", email: "sergey@mail.ru", phone: "+7 982 500-66-77", type: "private", registeredAt: "2026-01-08", listingsCount: 2, complaints: 0, status: "active" },
  { id: "u9", name: "МебельМаркет", email: "mebel@nyu.info", phone: "+7 3463 25-11-22", type: "business", registeredAt: "2025-04-15", listingsCount: 42, complaints: 2, status: "active" },
  { id: "u10", name: "Анна Кузнецова", email: "anna@yandex.ru", phone: "+7 922 400-88-99", type: "private", registeredAt: "2026-02-28", listingsCount: 0, complaints: 0, status: "active" },
];

// ── Moderation mock ──
export interface ModerationItem {
  id: string;
  listingTitle: string;
  author: string;
  district: string;
  reason: string;
  date: string;
  type: "new" | "complaint" | "suspicious" | "duplicate" | "no-photo" | "banned-words";
}

export const moderationItems: ModerationItem[] = [
  { id: "m1", listingTitle: "iPhone 16 Pro — СКИДКА 80%", author: "Неизвестный", district: "5 мкр", reason: "Подозрительная цена", date: "10.03.2026", type: "suspicious" },
  { id: "m2", listingTitle: "Квартира 2-к, 56 м²", author: "Мария", district: "2 мкр", reason: "Новое объявление", date: "10.03.2026", type: "new" },
  { id: "m3", listingTitle: "ВАЗ 2114, 2009 год", author: "Алексей", district: "14 мкр", reason: "Жалоба: мошенничество", date: "09.03.2026", type: "complaint" },
  { id: "m4", listingTitle: "Диван угловой", author: "Сергей", district: "Центр", reason: "Дубль объявления", date: "09.03.2026", type: "duplicate" },
  { id: "m5", listingTitle: "Услуги разнорабочего", author: "Иван", district: "Промзона", reason: "Без фото", date: "08.03.2026", type: "no-photo" },
  { id: "m6", listingTitle: "Работа — лёгкий заработок!!!", author: "Новый пользователь", district: "13 мкр", reason: "Запрещённые слова", date: "08.03.2026", type: "banned-words" },
  { id: "m7", listingTitle: "Toyota Camry 2021", author: "ЮганскАвто", district: "3 мкр", reason: "Новое объявление", date: "10.03.2026", type: "new" },
  { id: "m8", listingTitle: "Ремонт квартир под ключ", author: "НефтеСтрой", district: "Центр", reason: "Жалоба: неактуально", date: "09.03.2026", type: "complaint" },
];

// ── Banners mock ──
export interface MockBanner {
  id: string;
  title: string;
  advertiser: string;
  placement: string;
  page: string;
  district: string | null;
  category: string | null;
  size: string;
  status: "active" | "scheduled" | "expired" | "paused";
  startDate: string;
  endDate: string;
  type: "image" | "html" | "direct";
  imageUrl?: string;
  link?: string;
  htmlCode?: string;
  impressions: number;
  clicks: number;
}

export const mockBanners: MockBanner[] = [
  { id: "b1", title: "Автосалон — весенние скидки", advertiser: "ЮганскАвто", placement: "Верхний баннер", page: "Главная", district: null, category: null, size: "1200×200", status: "active", startDate: "2026-03-01", endDate: "2026-03-31", type: "image", imageUrl: "/placeholder.svg", link: "https://example.com", impressions: 12400, clicks: 340 },
  { id: "b2", title: "Новостройки 8 мкр", advertiser: "НефтеСтрой", placement: "Баннер под поиском", page: "Категория", district: "8 мкр", category: "realty", size: "728×90", status: "active", startDate: "2026-02-15", endDate: "2026-04-15", type: "image", imageUrl: "/placeholder.svg", link: "https://example.com", impressions: 8700, clicks: 210 },
  { id: "b3", title: "Ремонт техники", advertiser: "ТехноСервис", placement: "Баннер в ленте", page: "Главная", district: null, category: "electronics", size: "600×300", status: "paused", startDate: "2026-01-10", endDate: "2026-03-10", type: "image", imageUrl: "/placeholder.svg", link: "https://example.com", impressions: 5400, clicks: 89 },
  { id: "b4", title: "Яндекс.Директ блок", advertiser: "Яндекс", placement: "Сайдбар", page: "Все страницы", district: null, category: null, size: "300×250", status: "active", startDate: "2026-01-01", endDate: "2026-12-31", type: "direct", htmlCode: "<!-- yandex_rtb_R-A-XXXXXX-1 -->", impressions: 45000, clicks: 1200 },
  { id: "b5", title: "Мебель со скидкой 30%", advertiser: "МебельМаркет", placement: "Баннер между блоками", page: "Главная", district: "Центр", category: "home", size: "1200×200", status: "scheduled", startDate: "2026-03-15", endDate: "2026-04-15", type: "image", imageUrl: "/placeholder.svg", link: "https://example.com", impressions: 0, clicks: 0 },
  { id: "b6", title: "Google AdSense", advertiser: "Google", placement: "Баннер в карточке", page: "Объявление", district: null, category: null, size: "336×280", status: "active", startDate: "2026-01-01", endDate: "2026-12-31", type: "direct", htmlCode: "<!-- adsense -->", impressions: 32000, clicks: 890 },
  { id: "b7", title: "Стройматериалы оптом", advertiser: "СтройБаза", placement: "Баннер по районам", page: "Район", district: "Промзона", category: null, size: "728×90", status: "expired", startDate: "2026-01-01", endDate: "2026-02-28", type: "image", imageUrl: "/placeholder.svg", link: "https://example.com", impressions: 18000, clicks: 430 },
];

// ── Campaigns mock ──
export interface MockCampaign {
  id: string;
  name: string;
  advertiser: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed";
  bannerIds: string[];
  districts: string[];
  categories: string[];
}

export const mockCampaigns: MockCampaign[] = [
  { id: "c1", name: "Весна 2026 — Авто", advertiser: "ЮганскАвто", budget: 50000, spent: 18500, startDate: "2026-03-01", endDate: "2026-03-31", status: "active", bannerIds: ["b1"], districts: [], categories: ["transport"] },
  { id: "c2", name: "Новостройки 8 мкр", advertiser: "НефтеСтрой", budget: 80000, spent: 34200, startDate: "2026-02-15", endDate: "2026-04-15", status: "active", bannerIds: ["b2"], districts: ["8 мкр"], categories: ["realty"] },
  { id: "c3", name: "Мебель — март", advertiser: "МебельМаркет", budget: 30000, spent: 0, startDate: "2026-03-15", endDate: "2026-04-15", status: "paused", bannerIds: ["b5"], districts: ["Центр"], categories: ["home"] },
];

// ── Promotions mock ──
export const promotionListings = listings.filter(l => l.vip || l.promoted || l.promotion_type).slice(0, 10);

// ── Logs mock ──
export interface AdminLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  date: string;
  time: string;
}

export const adminLogs: AdminLog[] = [
  { id: "l1", admin: "info@tyumen.info", action: "Удалил объявление", target: "iPhone 16 Pro — СКИДКА 80%", date: "10.03.2026", time: "14:22" },
  { id: "l2", admin: "info@tyumen.info", action: "Включил баннер", target: "Автосалон — весенние скидки", date: "10.03.2026", time: "13:50" },
  { id: "l3", admin: "info@tyumen.info", action: "Заблокировал пользователя", target: "Дмитрий Козлов", date: "09.03.2026", time: "18:15" },
  { id: "l4", admin: "info@tyumen.info", action: "Изменил тариф VIP", target: "299 ₽ → 349 ₽", date: "09.03.2026", time: "11:30" },
  { id: "l5", admin: "info@tyumen.info", action: "Одобрил объявление", target: "Toyota Camry 2021", date: "09.03.2026", time: "10:45" },
  { id: "l6", admin: "info@tyumen.info", action: "Остановил кампанию", target: "Мебель — март", date: "08.03.2026", time: "16:20" },
  { id: "l7", admin: "info@tyumen.info", action: "Создал баннер", target: "Мебель со скидкой 30%", date: "08.03.2026", time: "15:00" },
  { id: "l8", admin: "info@tyumen.info", action: "Удалил объявление", target: "Работа — лёгкий заработок!!!", date: "08.03.2026", time: "12:10" },
  { id: "l9", admin: "info@tyumen.info", action: "Назначил VIP", target: "BMW X5 2022, M-пакет", date: "07.03.2026", time: "09:30" },
  { id: "l10", admin: "info@tyumen.info", action: "Одобрил бизнес-аккаунт", target: "МебельМаркет", date: "07.03.2026", time: "09:00" },
];

// ── Tariffs mock ──
export interface Tariff {
  id: string;
  name: string;
  price: number;
  unit: string;
  active: boolean;
}

export const tariffs: Tariff[] = [
  { id: "t1", name: "Поднятие объявления", price: 99, unit: "₽", active: true },
  { id: "t2", name: "VIP", price: 299, unit: "₽", active: true },
  { id: "t3", name: "TOP", price: 199, unit: "₽", active: true },
  { id: "t4", name: "Срочно", price: 49, unit: "₽", active: true },
  { id: "t5", name: "VIP по району", price: 399, unit: "₽", active: true },
  { id: "t6", name: "Баннер на день", price: 500, unit: "₽", active: true },
  { id: "t7", name: "Баннер на неделю", price: 2500, unit: "₽", active: true },
  { id: "t8", name: "Баннер на месяц", price: 8000, unit: "₽", active: true },
  { id: "t9", name: "Бизнес-аккаунт", price: 990, unit: "₽/мес", active: true },
];

// ── Notifications mock ──
export interface AdminNotification {
  id: string;
  message: string;
  type: "moderation" | "complaint" | "banner" | "vip" | "campaign" | "business";
  date: string;
  read: boolean;
}

export const adminNotifications: AdminNotification[] = [
  { id: "n1", message: "Новое объявление на модерации: Toyota Camry 2021", type: "moderation", date: "10.03.2026 14:30", read: false },
  { id: "n2", message: "Жалоба на объявление: ВАЗ 2114, 2009 год", type: "complaint", date: "09.03.2026 18:20", read: false },
  { id: "n3", message: "Баннер «Ремонт техники» истёк", type: "banner", date: "10.03.2026 00:00", read: false },
  { id: "n4", message: "VIP закончился: Шуба норковая", type: "vip", date: "09.03.2026 23:59", read: true },
  { id: "n5", message: "Кампания «Мебель — март» приостановлена", type: "campaign", date: "08.03.2026 16:20", read: true },
  { id: "n6", message: "Новый бизнес-аккаунт на проверке: ЗооМир НЮ", type: "business", date: "08.03.2026 10:00", read: true },
];
