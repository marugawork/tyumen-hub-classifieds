import {
  Car, Home, Briefcase, Wrench, Shirt, Sofa, Smartphone, Dumbbell,
  PawPrint, Building2, Gift, ArrowLeftRight, Bike, Truck, Ship, Cog,
  Key, Building, DoorOpen, Warehouse, LandPlot, ParkingCircle,
  FileText, UserCheck, Clock, Hammer, Heart, Package, GraduationCap,
  Megaphone, Monitor, Handshake, Baby, Watch, Sparkles, Armchair,
  UtensilsCrossed, TreePine, Tv, Gamepad2, Camera, WashingMachine,
  Trophy, Music, BookOpen, Dog, Cat, Bird, Fish, ShoppingBag, Factory, Boxes,
  type LucideIcon
} from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  icon?: LucideIcon;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  colorClass: string;
  colorVar: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    id: "transport",
    name: "Транспорт",
    slug: "transport",
    icon: Car,
    colorClass: "bg-cat-transport",
    colorVar: "cat-transport",
    subcategories: [
      { id: "auto", name: "Автомобили", slug: "avtomobili", icon: Car },
      { id: "moto", name: "Мотоциклы и мототехника", slug: "mototehnika", icon: Bike },
      { id: "trucks", name: "Грузовики и спецтехника", slug: "gruzoviki", icon: Truck },
      { id: "water", name: "Водный транспорт", slug: "vodnyj-transport", icon: Ship },
      { id: "parts", name: "Запчасти и аксессуары", slug: "zapchasti", icon: Cog },
    ],
  },
  {
    id: "realty",
    name: "Недвижимость",
    slug: "nedvizhimost",
    icon: Home,
    colorClass: "bg-cat-realty",
    colorVar: "cat-realty",
    subcategories: [
      { id: "apartments", name: "Квартиры", slug: "kvartiry", icon: Key },
      { id: "houses", name: "Дома, дачи, коттеджи", slug: "doma", icon: Home },
      { id: "rooms", name: "Комнаты", slug: "komnaty", icon: DoorOpen },
      { id: "commercial", name: "Коммерческая недвижимость", slug: "kommercheskaya", icon: Building },
      { id: "land", name: "Земельные участки", slug: "uchastki", icon: LandPlot },
      { id: "garages", name: "Гаражи и машиноместа", slug: "garazhi", icon: ParkingCircle },
    ],
  },
  {
    id: "work",
    name: "Работа",
    slug: "rabota",
    icon: Briefcase,
    colorClass: "bg-cat-work",
    colorVar: "cat-work",
    subcategories: [
      { id: "vacancies", name: "Вакансии", slug: "vakansii", icon: FileText },
      { id: "resumes", name: "Резюме", slug: "rezyume", icon: UserCheck },
      { id: "parttime", name: "Подработка", slug: "podrabotka", icon: Clock },
    ],
  },
  {
    id: "services",
    name: "Услуги",
    slug: "uslugi",
    icon: Wrench,
    colorClass: "bg-cat-services",
    colorVar: "cat-services",
    subcategories: [
      { id: "repair", name: "Ремонт и строительство", slug: "remont", icon: Hammer },
      { id: "beauty", name: "Красота и здоровье", slug: "krasota", icon: Heart },
      { id: "moving", name: "Перевозки, грузчики", slug: "perevozki", icon: Package },
      { id: "education", name: "Обучение", slug: "obuchenie", icon: GraduationCap },
      { id: "marketing", name: "Реклама/маркетинг", slug: "reklama", icon: Megaphone },
      { id: "it", name: "Компьютерные услуги", slug: "kompyuternye", icon: Monitor },
      { id: "biz-services", name: "Деловые услуги", slug: "delovye", icon: Handshake },
    ],
  },
  {
    id: "personal",
    name: "Личные вещи",
    slug: "lichnye-veschi",
    icon: Shirt,
    colorClass: "bg-cat-personal",
    colorVar: "cat-personal",
    subcategories: [
      { id: "clothing", name: "Одежда, обувь, аксессуары", slug: "odezhda", icon: Shirt },
      { id: "kids-clothing", name: "Детская одежда и обувь", slug: "detskaya-odezhda", icon: Baby },
      { id: "watches", name: "Часы/украшения", slug: "chasy", icon: Watch },
      { id: "beauty-care", name: "Красота и уход", slug: "krasota-uhod", icon: Sparkles },
    ],
  },
  {
    id: "home",
    name: "Для дома и дачи",
    slug: "dlya-doma",
    icon: Sofa,
    colorClass: "bg-cat-home",
    colorVar: "cat-home",
    subcategories: [
      { id: "furniture", name: "Мебель и интерьер", slug: "mebel", icon: Armchair },
      { id: "kitchen", name: "Посуда и товары для кухни", slug: "posuda", icon: UtensilsCrossed },
      { id: "repair-goods", name: "Ремонт и строительство (товары)", slug: "tovary-remont", icon: Hammer },
      { id: "garden", name: "Растения/сад", slug: "sad", icon: TreePine },
    ],
  },
  {
    id: "electronics",
    name: "Электроника",
    slug: "elektronika",
    icon: Smartphone,
    colorClass: "bg-cat-electronics",
    colorVar: "cat-electronics",
    subcategories: [
      { id: "phones", name: "Телефоны", slug: "telefony", icon: Smartphone },
      { id: "computers", name: "Компьютеры/ноутбуки", slug: "kompyutery", icon: Monitor },
      { id: "tv-audio", name: "ТВ/аудио", slug: "tv-audio", icon: Tv },
      { id: "games", name: "Игры/приставки", slug: "igry", icon: Gamepad2 },
      { id: "photo", name: "Фото/видео", slug: "foto-video", icon: Camera },
      { id: "appliances", name: "Бытовая техника", slug: "bytovaya-tehnika", icon: WashingMachine },
    ],
  },
  {
    id: "hobby",
    name: "Хобби и отдых",
    slug: "hobbi",
    icon: Dumbbell,
    colorClass: "bg-cat-hobby",
    colorVar: "cat-hobby",
    subcategories: [
      { id: "sport", name: "Спорт и отдых", slug: "sport", icon: Trophy },
      { id: "collecting", name: "Хобби/коллекционирование", slug: "kollekcionirovanie" },
      { id: "music", name: "Музыкальные инструменты", slug: "muzykalnye", icon: Music },
      { id: "books", name: "Книги/журналы", slug: "knigi", icon: BookOpen },
    ],
  },
  {
    id: "animals",
    name: "Животные",
    slug: "zhivotnye",
    icon: PawPrint,
    colorClass: "bg-cat-animals",
    colorVar: "cat-animals",
    subcategories: [
      { id: "dogs", name: "Собаки", slug: "sobaki", icon: Dog },
      { id: "cats", name: "Кошки", slug: "koshki", icon: Cat },
      { id: "birds", name: "Птицы", slug: "pticy", icon: Bird },
      { id: "aquarium", name: "Аквариум", slug: "akvarium", icon: Fish },
      { id: "pet-goods", name: "Товары для животных", slug: "tovary-dlya-zhivotnyh", icon: ShoppingBag },
    ],
  },
  {
    id: "business",
    name: "Для бизнеса",
    slug: "dlya-biznesa",
    icon: Building2,
    colorClass: "bg-cat-business",
    colorVar: "cat-business",
    subcategories: [
      { id: "ready-biz", name: "Готовый бизнес", slug: "gotovyj-biznes", icon: Building2 },
      { id: "equipment", name: "Оборудование", slug: "oborudovanie", icon: Factory },
      { id: "wholesale", name: "Товары оптом", slug: "optom", icon: Boxes },
    ],
  },
  {
    id: "free",
    name: "Отдам даром",
    slug: "otdam-darom",
    icon: Gift,
    colorClass: "bg-cat-free",
    colorVar: "cat-free",
    subcategories: [],
  },
  {
    id: "exchange",
    name: "Обмен",
    slug: "obmen",
    icon: ArrowLeftRight,
    colorClass: "bg-cat-exchange",
    colorVar: "cat-exchange",
    subcategories: [],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getSubcategory(categoryId: string, subcategoryId: string): SubCategory | undefined {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories.find(s => s.id === subcategoryId);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): SubCategory | undefined {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subcategories.find(s => s.slug === subcategorySlug);
}
