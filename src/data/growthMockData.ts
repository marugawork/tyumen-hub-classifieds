// Mock data for Growth Engine — replaced by real DB queries in later phases
export interface GrowthMetricSnapshot {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalListings: number;
  newListings: number;
  revenue: number;
}

export const growthDailySnapshots: GrowthMetricSnapshot[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const baseUsers = 1200 + i * 28;
  const baseListings = 850 + i * 22;
  return {
    date: d.toISOString().slice(5, 10),
    totalUsers: baseUsers + Math.floor(Math.random() * 40),
    newUsers: 18 + Math.floor(Math.random() * 25),
    activeUsers: Math.floor((baseUsers + Math.random() * 40) * 0.42),
    totalListings: baseListings + Math.floor(Math.random() * 30),
    newListings: 12 + Math.floor(Math.random() * 20),
    revenue: 3500 + Math.floor(Math.random() * 4500) + i * 120,
  };
});

export const growthSummary = {
  usersWoW: 12.4,
  usersMoM: 38.2,
  listingsWoW: 8.7,
  listingsMoM: 26.5,
  revenueWoW: 18.3,
  revenueMoM: 52.1,
  activationRate: 64.2,
  retention7d: 41.8,
  retention30d: 22.6,
  viralCoefficient: 1.18,
};

export interface AIRecommendation {
  id: string;
  type: "city_launch" | "category_growth" | "ad_placement" | "pricing" | "reactivation";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  impact: string;
}

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "r1",
    type: "category_growth",
    priority: "high",
    title: "Категория «Работа» отстаёт",
    description: "В категории «Работа» только 34 объявления — это 2.1% от общего количества. В аналогичных городах эта категория даёт 12-18% контента.",
    impact: "+~180 объявлений / +12% MAU за 30 дней",
  },
  {
    id: "r2",
    type: "city_launch",
    priority: "high",
    title: "Запустить Сургут",
    description: "Сургут граничит с Нефтеюганском, имеет 380к жителей и схожий профиль. Платформа готова к мультигородскому масштабированию.",
    impact: "+2.4x пользователей за 6 месяцев",
  },
  {
    id: "r3",
    type: "reactivation",
    priority: "medium",
    title: "Реактивировать 184 неактивных пользователя",
    description: "184 пользователя не заходили 14+ дней, но имеют активные объявления. Email-рассылка с подборкой цен может вернуть 18-25%.",
    impact: "+30-45 DAU",
  },
  {
    id: "r4",
    type: "ad_placement",
    priority: "medium",
    title: "Добавить inline-баннер в карточку объявления",
    description: "Текущие баннеры показывают CTR 0.8%. Inline-баннер между блоками описания и продавца исторически даёт 2.3-3.1% CTR.",
    impact: "+15-22% к доходу от рекламы",
  },
  {
    id: "r5",
    type: "pricing",
    priority: "low",
    title: "Снизить цену на «Поднятие» на 20%",
    description: "Conversion к покупке поднятия — 1.4%. Снижение цены может увеличить объём покупок на 35-40% при росте дохода 8-12%.",
    impact: "+8-12% дохода",
  },
];

export const cityLaunchCandidates = [
  { city: "Сургут", population: 380000, readiness: 92, distance: 75 },
  { city: "Ханты-Мансийск", population: 105000, readiness: 78, distance: 245 },
  { city: "Нижневартовск", population: 280000, readiness: 85, distance: 240 },
  { city: "Когалым", population: 68000, readiness: 64, distance: 175 },
];

export const categoryGrowthData = [
  { name: "Недвижимость", current: 312, potential: 480, gap: 35 },
  { name: "Транспорт", current: 285, potential: 410, gap: 30 },
  { name: "Электроника", current: 198, potential: 320, gap: 38 },
  { name: "Работа", current: 34, potential: 220, gap: 85 },
  { name: "Услуги", current: 156, potential: 280, gap: 44 },
  { name: "Личные вещи", current: 124, potential: 200, gap: 38 },
];
