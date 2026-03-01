import { districts } from "./districts";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  photos: string[];
  categoryId: string;
  subcategoryId: string;
  condition: "new" | "used";
  district: string;
  address: string;
  authorName: string;
  authorType: "private" | "business";
  authorPhone: string;
  authorLogo?: string;
  authorDescription?: string;
  authorRating?: number;
  authorVerified?: boolean;
  createdAt: string;
  flags: {
    urgent?: boolean;
    bargain?: boolean;
    delivery?: boolean;
  };
  vip?: boolean;
  promoted?: boolean;
  boost_district?: boolean;
  views: number;
  favorites: number;
}

const photoPlaceholders: Record<string, string[]> = {
  auto: [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop",
  ],
  moto: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"],
  apartments: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  ],
  houses: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"],
  phones: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop"],
  computers: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"],
  furniture: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"],
  clothing: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"],
  sport: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop"],
  dogs: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop"],
  cats: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop"],
  repair: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop"],
  trucks: ["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop"],
  appliances: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop"],
  default: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"],
};

function getPhotos(subcat: string): string[] {
  return photoPlaceholders[subcat] || photoPlaceholders.default;
}

function assignDistrict(index: number): string {
  return districts[index % districts.length];
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

function randomViews(): number {
  return Math.floor(Math.random() * 800) + 20;
}

function randomFavs(): number {
  return Math.floor(Math.random() * 40);
}

const names = ["Алексей", "Мария", "Дмитрий", "Елена", "Сергей", "Анна", "Иван", "Ольга", "Андрей", "Наталья", "Павел", "Татьяна", "Виктор", "Светлана", "Михаил", "Артём", "Юлия", "Руслан", "Кристина", "Александр"];
const bizNames = ["АвтоМир НЮ", "НефтеСтрой", "ТехноСервис", "МебельМаркет", "СтройБаза", "ТелефонМаг", "ЗооМир НЮ", "ЮганскАвто", "Комфорт-Дом", "НефтеТорг"];
const phones = ["+7 (3463) 22-XX-XX", "+7 (3463) 25-XX-XX", "+7 (912) 425-XX-XX", "+7 (982) 500-XX-XX", "+7 (922) 400-XX-XX"];

function randomAuthor(forceBiz?: boolean): { name: string; type: "private" | "business"; phone: string; logo?: string; description?: string; rating?: number; verified?: boolean } {
  const isBiz = forceBiz || Math.random() < 0.2;
  if (isBiz) {
    const name = bizNames[Math.floor(Math.random() * bizNames.length)];
    return {
      name,
      type: "business",
      phone: phones[Math.floor(Math.random() * phones.length)].replace("XX", String(Math.floor(Math.random() * 90) + 10)),
      description: `Компания «${name}» — надёжный партнёр в Нефтеюганске. Работаем с 2015 года.`,
      rating: Number((4 + Math.random()).toFixed(1)),
      verified: Math.random() > 0.3,
    };
  }
  return {
    name: names[Math.floor(Math.random() * names.length)],
    type: "private",
    phone: phones[Math.floor(Math.random() * phones.length)].replace("XX", String(Math.floor(Math.random() * 90) + 10)),
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
  };
}

function flags(): { urgent?: boolean; bargain?: boolean; delivery?: boolean } {
  return {
    urgent: Math.random() < 0.12,
    bargain: Math.random() < 0.25,
    delivery: Math.random() < 0.18,
  };
}

interface ListingSeed {
  title: string;
  desc: string;
  price: number;
  catId: string;
  subId: string;
  cond: "new" | "used";
  vip?: boolean;
  bizAuthor?: boolean;
}

const seeds: ListingSeed[] = [
  // Transport - auto (VIP included)
  { title: "Toyota Camry 2021, максималка", desc: "Один владелец, полный пакет ТО у дилера. Кожа, камера, LED. Идеальное состояние.", price: 2650000, catId: "transport", subId: "auto", cond: "used", vip: true, bizAuthor: true },
  { title: "Kia Rio 2020, чёрный", desc: "Пробег 55 000 км. Кондиционер, подогрев, зимняя резина в подарок.", price: 1250000, catId: "transport", subId: "auto", cond: "used" },
  { title: "BMW X5 2022, M-пакет", desc: "Панорама, пневмоподвеска, адаптивный круиз. Один хозяин.", price: 6200000, catId: "transport", subId: "auto", cond: "used", vip: true },
  { title: "ВАЗ 2114, 2009 год", desc: "На ходу, вложений не требует. Свежее ТО.", price: 130000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Hyundai Tucson 2023", desc: "Гарантия дилера, пробег 15 000 км. Все опции.", price: 3400000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Mercedes-Benz E-class 2019", desc: "AMG Line, панорамная крыша, Burmester.", price: 3900000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Volkswagen Polo 2022", desc: "Автомат, 28 000 км, первый владелец.", price: 1550000, catId: "transport", subId: "auto", cond: "used" },
  { title: "УАЗ Патриот 2021", desc: "Полный привод, кондиционер, ABS. Пробег 40 000.", price: 1300000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Lada Vesta SW Cross 2022", desc: "Вариатор, климат-контроль, подогрев всего. 25 000 км.", price: 1450000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Toyota Land Cruiser 200, 2018", desc: "Дизель, 4.5, максималка. Пробег 90 000 км.", price: 5500000, catId: "transport", subId: "auto", cond: "used", vip: true, bizAuthor: true },
  { title: "Hyundai Solaris 2019, серебристый", desc: "Пробег 70 000 км. Автомат, кондиционер.", price: 980000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Лада Гранта 2021, на гарантии", desc: "Пробег 25 000 км. Первый владелец.", price: 700000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Renault Duster 2020, 4WD", desc: "Полный привод, 2.0, механика. Пробег 60 000 км.", price: 1150000, catId: "transport", subId: "auto", cond: "used" },
  // Moto
  { title: "Yamaha YZF-R3, 2021", desc: "Спортбайк в идеале. Пробег 4000 км.", price: 480000, catId: "transport", subId: "moto", cond: "used" },
  { title: "Honda CB500F 2022", desc: "Нейкед, 2500 км пробег.", price: 550000, catId: "transport", subId: "moto", cond: "used" },
  // Trucks
  { title: "ГАЗель Next, 2020, тент", desc: "Бортовая, дизель. Пробег 65 000 км.", price: 1800000, catId: "transport", subId: "trucks", cond: "used" },
  { title: "КамАЗ самосвал 2017", desc: "6520, грузоподъёмность 20 тонн. Хорошее состояние.", price: 3200000, catId: "transport", subId: "trucks", cond: "used" },
  // Parts
  { title: "Комплект зимних шин R16", desc: "Bridgestone Blizzak, 205/55 R16. Износ 15%.", price: 14000, catId: "transport", subId: "parts", cond: "used" },
  { title: "Фары LED Toyota Camry V70", desc: "Новые, в упаковке.", price: 28000, catId: "transport", subId: "parts", cond: "new" },
  { title: "Аккумулятор Varta 75 Ah", desc: "Новый, гарантия 2 года.", price: 8500, catId: "transport", subId: "parts", cond: "new" },

  // Realty
  { title: "2-к квартира, 56 м², 5/9 эт.", desc: "Свежий ремонт, мебель, техника. Тихий двор. 2 микрорайон.", price: 4800000, catId: "realty", subId: "apartments", cond: "used", vip: true },
  { title: "1-к квартира, 36 м², новостройка", desc: "Черновая отделка. 8 этаж, вид на город.", price: 3200000, catId: "realty", subId: "apartments", cond: "new" },
  { title: "3-к квартира, 75 м², Центр", desc: "Евроремонт, два санузла, гардеробная.", price: 7200000, catId: "realty", subId: "apartments", cond: "used" },
  { title: "Студия 24 м², 11 микрорайон", desc: "Полностью меблированная, рядом магазины.", price: 2100000, catId: "realty", subId: "apartments", cond: "used" },
  { title: "Аренда 2-к, 50 м²", desc: "Долгосрочная аренда. Мебель, техника, интернет.", price: 22000, catId: "realty", subId: "apartments", cond: "used" },
  { title: "Аренда 1-к, Пионерный", desc: "После ремонта, новая мебель. Рядом остановка.", price: 16000, catId: "realty", subId: "apartments", cond: "used" },
  { title: "Дом 150 м², участок 10 сот.", desc: "Газ, вода, баня, гараж на 2 авто.", price: 9500000, catId: "realty", subId: "houses", cond: "used", vip: true, bizAuthor: true },
  { title: "Дача в СНТ «Берёзка»", desc: "Дом 55 м², участок 6 соток. Свет, вода.", price: 1500000, catId: "realty", subId: "houses", cond: "used" },
  { title: "Комната 15 м², общежитие", desc: "Ремонт, мебель.", price: 750000, catId: "realty", subId: "rooms", cond: "used" },
  { title: "Офис 50 м², Центр", desc: "Первый этаж, отдельный вход. Парковка.", price: 32000, catId: "realty", subId: "commercial", cond: "used" },
  { title: "Земельный участок 12 соток", desc: "ИЖС, коммуникации по границе. Сингапай.", price: 1800000, catId: "realty", subId: "land", cond: "new" },
  { title: "Гараж 24 м², ГСК «Мотор»", desc: "Капитальный, подвал, смотровая яма.", price: 550000, catId: "realty", subId: "garages", cond: "used" },
  { title: "4-к квартира, 95 м², 16 мкр", desc: "Просторная, 2 лоджии. Хороший ремонт.", price: 8500000, catId: "realty", subId: "apartments", cond: "used" },

  // Work
  { title: "Менеджер по продажам", desc: "Оклад + бонусы. 5/2. Опыт от 1 года.", price: 70000, catId: "work", subId: "vacancies", cond: "new" },
  { title: "Водитель категории B", desc: "Доставка по городу. Авто компании.", price: 60000, catId: "work", subId: "vacancies", cond: "new" },
  { title: "Программист Python/Django", desc: "Удалённо. E-commerce. Опыт от 2 лет.", price: 160000, catId: "work", subId: "vacancies", cond: "new" },
  { title: "Бухгалтер на первичку", desc: "Частичная занятость. 1С обязательно.", price: 38000, catId: "work", subId: "vacancies", cond: "new" },
  { title: "Оператор ЧПУ", desc: "Опыт от 3 лет. Вахта 30/30. Проживание.", price: 120000, catId: "work", subId: "vacancies", cond: "new", vip: true, bizAuthor: true },
  { title: "Сварщик НАКС, вахта", desc: "Вахта 45/45. Достойная оплата. Проживание.", price: 150000, catId: "work", subId: "vacancies", cond: "new" },
  { title: "Резюме: инженер-строитель", desc: "Опыт 12 лет, ПГС. Ищу работу.", price: 0, catId: "work", subId: "resumes", cond: "new" },
  { title: "Подработка: расклейка объявлений", desc: "По выходным. Оплата в день.", price: 3000, catId: "work", subId: "parttime", cond: "new" },
  { title: "Курьер Яндекс Еда", desc: "Свободный график. Своё авто или пешком.", price: 3500, catId: "work", subId: "parttime", cond: "new" },
  { title: "Продавец-консультант", desc: "Салон связи. Оклад 45 000 + бонусы.", price: 65000, catId: "work", subId: "vacancies", cond: "new" },

  // Services
  { title: "Ремонт квартир под ключ", desc: "Все виды работ. Портфолио, договор, гарантия.", price: 0, catId: "services", subId: "repair", cond: "new", bizAuthor: true },
  { title: "Электрик — вызов на дом", desc: "Замена проводки, розетки, автоматы. Быстро.", price: 1500, catId: "services", subId: "repair", cond: "new" },
  { title: "Массаж профессиональный", desc: "Классический, спортивный. Сертификат.", price: 2500, catId: "services", subId: "beauty", cond: "new" },
  { title: "Грузоперевозки ГАЗель", desc: "По городу и области. Грузчики.", price: 1200, catId: "services", subId: "moving", cond: "new" },
  { title: "Репетитор математика ЕГЭ", desc: "Подготовка к ЕГЭ/ОГЭ. Опыт 10 лет.", price: 1500, catId: "services", subId: "education", cond: "new" },
  { title: "Создание сайтов и лендингов", desc: "Под ключ за 5 дней. Адаптивный дизайн, SEO.", price: 20000, catId: "services", subId: "it", cond: "new", bizAuthor: true },
  { title: "Сантехник — все виды работ", desc: "Установка, ремонт, замена. Выезд в день обращения.", price: 0, catId: "services", subId: "repair", cond: "new" },
  { title: "Юридические консультации", desc: "Гражданское, семейное, трудовое право. Первая консультация бесплатно.", price: 0, catId: "services", subId: "biz-services", cond: "new", bizAuthor: true },

  // Personal
  { title: "Куртка мужская Columbia, XL", desc: "Зимняя, пуховая. 1 сезон. Отличное состояние.", price: 6000, catId: "personal", subId: "clothing", cond: "used" },
  { title: "Платье вечернее, р. 44", desc: "Надевала один раз. Цвет бордо.", price: 3500, catId: "personal", subId: "clothing", cond: "used" },
  { title: "Кроссовки Nike Air Max, 43", desc: "Оригинал, коробка, чек. Новые.", price: 9500, catId: "personal", subId: "clothing", cond: "new" },
  { title: "Комбинезон детский зимний, 86", desc: "Мембранный, очень тёплый. Б/у 1 сезон.", price: 2500, catId: "personal", subId: "kids-clothing", cond: "used" },
  { title: "Часы Casio G-Shock GA-2100", desc: "Оригинал, полный комплект.", price: 10000, catId: "personal", subId: "watches", cond: "new" },
  { title: "Шуба норковая, р. 48", desc: "Итальянская норка, длинная. Состояние идеальное.", price: 85000, catId: "personal", subId: "clothing", cond: "used", vip: true },
  { title: "Пуховик Canada Goose, M", desc: "Оригинал, очень тёплый. Носил 2 сезона.", price: 35000, catId: "personal", subId: "clothing", cond: "used" },
  { title: "Коляска Anex 2в1", desc: "В отличном состоянии, все аксессуары.", price: 20000, catId: "personal", subId: "kids-clothing", cond: "used" },

  // Home
  { title: "Диван угловой «Монако»", desc: "Экокожа, бежевый. Раскладной, ящик. 280×170.", price: 38000, catId: "home", subId: "furniture", cond: "used" },
  { title: "Кухонный гарнитур 2.5 м", desc: "Белый глянец, столешница камень. Б/у 2 года.", price: 48000, catId: "home", subId: "furniture", cond: "used" },
  { title: "Стол обеденный раздвижной", desc: "Массив дуба, 120-160 см. Новый.", price: 30000, catId: "home", subId: "furniture", cond: "new" },
  { title: "Набор кастрюль Tefal, 5 пр.", desc: "Нержавеющая сталь, в упаковке.", price: 7000, catId: "home", subId: "kitchen", cond: "new" },
  { title: "Ламинат 33 класс, 20 м²", desc: "Дуб натуральный, 8 мм. Остаток после ремонта.", price: 5500, catId: "home", subId: "repair-goods", cond: "new" },
  { title: "Шкаф-купе 3-створчатый", desc: "Зеркальные двери, ширина 2.4 м. Разберу.", price: 18000, catId: "home", subId: "furniture", cond: "used" },
  { title: "Комод с зеркалом IKEA", desc: "Белый, 6 ящиков. Хорошее состояние.", price: 8000, catId: "home", subId: "furniture", cond: "used" },

  // Electronics
  { title: "iPhone 15 Pro, 256 ГБ", desc: "Чёрный, идеал. Коробка, зарядка, чехол.", price: 85000, catId: "electronics", subId: "phones", cond: "used", vip: true },
  { title: "Samsung Galaxy S24, 128 ГБ", desc: "Белый, гарантия до 12.2025. Без царапин.", price: 52000, catId: "electronics", subId: "phones", cond: "used" },
  { title: "Xiaomi Redmi Note 13 Pro", desc: "Новый, запечатан. Гарантия.", price: 24000, catId: "electronics", subId: "phones", cond: "new" },
  { title: "iPhone 13, 128 ГБ", desc: "Состояние 9/10. Полный комплект.", price: 42000, catId: "electronics", subId: "phones", cond: "used" },
  { title: "Ноутбук ASUS VivoBook 15", desc: "i5-1335U, 16 ГБ, SSD 512 ГБ. Гарантия.", price: 58000, catId: "electronics", subId: "computers", cond: "new" },
  { title: "MacBook Air M2, 2024", desc: "8/256, идеал. 30 циклов батареи.", price: 100000, catId: "electronics", subId: "computers", cond: "used" },
  { title: "Игровой ПК: RTX 4070, i7-13700", desc: "32 ГБ DDR5, SSD 1 ТБ, монитор 27\" 165 Гц.", price: 140000, catId: "electronics", subId: "computers", cond: "used" },
  { title: "Телевизор Samsung 55\" QLED 4K", desc: "Smart TV, 2024 год. Коробка.", price: 45000, catId: "electronics", subId: "tv-audio", cond: "used" },
  { title: "PlayStation 5, Digital Edition", desc: "2 геймпада, подписка PS+. Идеал.", price: 40000, catId: "electronics", subId: "games", cond: "used" },
  { title: "Canon EOS R6 II + объектив", desc: "RF 24-105mm f/4L. 3000 кадров.", price: 300000, catId: "electronics", subId: "photo", cond: "used" },
  { title: "Стиральная машина LG 8 кг", desc: "Инверторный мотор, Steam. Гарантия.", price: 32000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Робот-пылесос Xiaomi Roborock S8", desc: "Влажная уборка, лидар, приложение.", price: 22000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Холодильник Samsung No Frost", desc: "Двухкамерный, 185 см. Отличное состояние.", price: 25000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Микроволновка Samsung, 23 л", desc: "Гриль, инверторный. Почти новая.", price: 6000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Наушники AirPods Pro 2", desc: "Оригинал, кейс, коробка. USB-C.", price: 18000, catId: "electronics", subId: "phones", cond: "used" },

  // Hobby
  { title: "Велосипед горный Stels Navigator", desc: "Рама 19\", колёса 29\". Гидравлика.", price: 24000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Беговая дорожка Torneo", desc: "Электрическая, до 120 кг. Тихая.", price: 18000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Лыжи Fischer RCS, 192 см", desc: "Коньковый ход, крепления, палки.", price: 9000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Снегоход Yamaha Viking 540", desc: "В хорошем состоянии. Документы.", price: 350000, catId: "hobby", subId: "sport", cond: "used", vip: true },
  { title: "Гитара акустическая Yamaha F310", desc: "Чехол в подарок.", price: 8000, catId: "hobby", subId: "music", cond: "used" },
  { title: "Синтезатор Casio CT-S200", desc: "61 клавиша. Почти не использовался.", price: 13000, catId: "hobby", subId: "music", cond: "used" },
  { title: "Коллекция монет СССР, 90 шт", desc: "Юбилейные и ходячие. Каталог.", price: 18000, catId: "hobby", subId: "collecting", cond: "used" },
  { title: "Самокат электрический Ninebot", desc: "Запас хода 35 км. Скорость 25 км/ч.", price: 28000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Коньки CCM Tacks 9092", desc: "Размер 42. Использовались 5 раз.", price: 12000, catId: "hobby", subId: "sport", cond: "used" },

  // Animals
  { title: "Щенки лабрадора, палевые", desc: "2 мальчика. Привиты, чипированы. РКФ.", price: 40000, catId: "animals", subId: "dogs", cond: "new" },
  { title: "Котёнок шотландский вислоухий", desc: "Голубой, мальчик. 2 месяца. Лоток.", price: 18000, catId: "animals", subId: "cats", cond: "new" },
  { title: "Попугай корелла с клеткой", desc: "Ручная, говорящая.", price: 6000, catId: "animals", subId: "birds", cond: "new" },
  { title: "Аквариум 200 л с тумбой", desc: "Полный комплект: фильтр, нагреватель, декор.", price: 20000, catId: "animals", subId: "aquarium", cond: "used" },
  { title: "Корм Royal Canin 10 кг", desc: "Indoor. Срок до 03.2026.", price: 5000, catId: "animals", subId: "pet-goods", cond: "new" },
  { title: "Породистый йорк, девочка", desc: "Мини, 1.5 года. Все прививки.", price: 28000, catId: "animals", subId: "dogs", cond: "new" },
  { title: "Хаски, мальчик, 3 месяца", desc: "Голубые глаза. Документы, прививки.", price: 30000, catId: "animals", subId: "dogs", cond: "new" },

  // Business
  { title: "Кофейня с оборудованием", desc: "Работающий бизнес в ТРЦ. Выручка 900 тыс./мес.", price: 2800000, catId: "business", subId: "ready-biz", cond: "used", vip: true, bizAuthor: true },
  { title: "Автомойка 3 бокса", desc: "Полностью оборудована. Поток клиентов.", price: 4500000, catId: "business", subId: "ready-biz", cond: "used", bizAuthor: true },
  { title: "Пекарное оборудование б/у", desc: "Печь, тестомес, расстойка. Рабочее.", price: 380000, catId: "business", subId: "equipment", cond: "used" },
  { title: "Одноразовая посуда оптом", desc: "Стаканы, тарелки, вилки. Мин. заказ 50 000.", price: 50000, catId: "business", subId: "wholesale", cond: "new", bizAuthor: true },
  { title: "Торговое оборудование б/у", desc: "Стеллажи, витрины, кассовый аппарат.", price: 200000, catId: "business", subId: "equipment", cond: "used" },
  { title: "Маникюрный кабинет (готовый)", desc: "Центр города. Клиентская база. Оборудование.", price: 650000, catId: "business", subId: "ready-biz", cond: "used" },

  // Free
  { title: "Отдам котят в добрые руки", desc: "3 котёнка, 2 месяца. Приучены к лотку.", price: 0, catId: "free", subId: "", cond: "new" },
  { title: "Отдам детские вещи пакетом", desc: "На мальчика 3-5 лет. Куртки, штаны.", price: 0, catId: "free", subId: "", cond: "used" },
  { title: "Диван б/у, самовывоз", desc: "Ещё крепкий, нужна чистка обивки.", price: 0, catId: "free", subId: "", cond: "used" },
  { title: "Книги и журналы, много", desc: "Несколько коробок. Классика, детективы.", price: 0, catId: "free", subId: "", cond: "used" },

  // Exchange
  { title: "Обменяю iPhone 14 на Samsung S24", desc: "Мой iPhone 14, 128 ГБ, состояние 9/10.", price: 0, catId: "exchange", subId: "", cond: "used" },
  { title: "Обменяю PS5 на Xbox Series X", desc: "PS5 с дисководом, 2 геймпада.", price: 0, catId: "exchange", subId: "", cond: "used" },

  // More transport
  { title: "Skoda Octavia 2019, лифтбек", desc: "1.4 TSI, автомат. Пробег 50 000 км.", price: 1800000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Nissan Qashqai 2021", desc: "2.0, вариатор. Пробег 35 000 км.", price: 2200000, catId: "transport", subId: "auto", cond: "used" },
  { title: "Лодка ПВХ 3.6 м + мотор 15 л.с.", desc: "Комплект: лодка, мотор, прицеп.", price: 180000, catId: "transport", subId: "water", cond: "used" },

  // More realty
  { title: "2-к квартира, 48 м², 3 мкр", desc: "Косметический ремонт. Тёплая, светлая.", price: 3900000, catId: "realty", subId: "apartments", cond: "used" },
  { title: "Таунхаус 120 м², Пионерный", desc: "2 этажа, 3 спальни, гараж.", price: 7800000, catId: "realty", subId: "houses", cond: "used" },

  // More services
  { title: "Фотограф на мероприятия", desc: "Свадьбы, юбилеи, корпоративы. Портфолио.", price: 5000, catId: "services", subId: "marketing", cond: "new" },
  { title: "Чистка мебели и ковров", desc: "Профессиональное оборудование. Выезд на дом.", price: 2000, catId: "services", subId: "beauty", cond: "new" },

  // More electronics
  { title: "Apple Watch Series 9, 45 мм", desc: "GPS + Cellular. Коробка, зарядка.", price: 32000, catId: "electronics", subId: "phones", cond: "used" },
  { title: "Видеокарта RTX 3060 12 ГБ", desc: "Palit Dual. Не майнил. Коробка.", price: 22000, catId: "electronics", subId: "computers", cond: "used" },

  // More personal
  { title: "Горнолыжный костюм Descente, M", desc: "Мужской. Мембрана 20 000. 1 сезон.", price: 15000, catId: "personal", subId: "clothing", cond: "used" },
  { title: "Сапоги UGG женские, 38", desc: "Оригинал, натуральная овчина.", price: 8000, catId: "personal", subId: "clothing", cond: "used" },

  // More home
  { title: "Пылесос Dyson V15 Detect", desc: "Беспроводной, все насадки. Год в эксплуатации.", price: 35000, catId: "home", subId: "furniture", cond: "used" },
  { title: "Кровать двуспальная с матрасом", desc: "160×200, матрас ортопедический.", price: 25000, catId: "home", subId: "furniture", cond: "used" },

  // More work
  { title: "Инженер КИПиА (нефтегаз)", desc: "Вахта 30/30. Опыт от 5 лет.", price: 180000, catId: "work", subId: "vacancies", cond: "new", bizAuthor: true },
  { title: "Повар-универсал в кафе", desc: "5/2, полная смена. Опыт от 2 лет.", price: 55000, catId: "work", subId: "vacancies", cond: "new" },

  // More hobby
  { title: "Квадрокоптер DJI Mini 3 Pro", desc: "Fly More Combo. Пробег минимальный.", price: 65000, catId: "hobby", subId: "collecting", cond: "used" },
  { title: "Палатка 4-местная Totem", desc: "Двухслойная, каркасная. Была в походе 2 раза.", price: 8000, catId: "hobby", subId: "sport", cond: "used" },

  // More animals
  { title: "Корги пемброк, щенки", desc: "Рыжие, с документами. Привиты.", price: 55000, catId: "animals", subId: "dogs", cond: "new" },

  // More business
  { title: "Вендинговые автоматы, 5 шт", desc: "Кофейные, в рабочем состоянии. Места.", price: 900000, catId: "business", subId: "equipment", cond: "used", bizAuthor: true },

  // Extras to reach 150+
  { title: "Генератор бензиновый 5 кВт", desc: "Новый, в упаковке. Гарантия 1 год.", price: 45000, catId: "home", subId: "repair-goods", cond: "new" },
  { title: "Электросамокат Kugoo S3 Pro", desc: "Запас хода 30 км. Складной.", price: 20000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Курьерская доставка в НЮ", desc: "По городу за 1 час. Оплата наличными/картой.", price: 500, catId: "services", subId: "moving", cond: "new", bizAuthor: true },
  { title: "Газонокосилка Husqvarna", desc: "Бензиновая, самоходная. 2 сезона.", price: 15000, catId: "home", subId: "garden", cond: "used" },
  { title: "Сноуборд Burton Custom 158", desc: "Доска + крепления. Хорошее состояние.", price: 18000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Принтер HP LaserJet M111a", desc: "Лазерный, ч/б. Мало печатал.", price: 8000, catId: "electronics", subId: "computers", cond: "used" },
  { title: "Детский велосипед 16\"", desc: "Для ребёнка 4-7 лет. Хорошее состояние.", price: 4000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Кондиционер Haier 12 BTU", desc: "Инверторный, с монтажом. Б/у 1 сезон.", price: 28000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Рюкзак Osprey Atmos AG 65", desc: "Туристический. Использовал 3 похода.", price: 12000, catId: "hobby", subId: "sport", cond: "used" },
  { title: "Набор инструментов DEKO, 168 пр.", desc: "В кейсе. Новый, не распаковывал.", price: 5500, catId: "home", subId: "repair-goods", cond: "new" },
  { title: "Свадебное платье, р. 44", desc: "А-силуэт, кружево. Надето 1 раз.", price: 15000, catId: "personal", subId: "clothing", cond: "used" },
  { title: "Музыкальный центр Sony MHC", desc: "Мощный звук, Bluetooth, караоке.", price: 12000, catId: "electronics", subId: "tv-audio", cond: "used" },
  { title: "Катер Казанка 5М4", desc: "С мотором Yamaha 40 л.с. Документы.", price: 420000, catId: "transport", subId: "water", cond: "used" },
  { title: "Баня на колёсах — аренда", desc: "Мобильная баня на прицепе. Доставка.", price: 5000, catId: "services", subId: "repair", cond: "new" },
  { title: "Мотобуксировщик Бурлак", desc: "500 куб.см. Пробег 200 км.", price: 120000, catId: "transport", subId: "moto", cond: "used" },
  { title: "Утеплённая бытовка 6×2.4 м", desc: "Минвата 100мм, электричество. Доставка.", price: 180000, catId: "home", subId: "repair-goods", cond: "new", bizAuthor: true },
  { title: "Посудомоечная машина Bosch 60", desc: "Встраиваемая, 14 комплектов. Б/у 1 год.", price: 20000, catId: "electronics", subId: "appliances", cond: "used" },
  { title: "Сушильная машина Beko", desc: "7 кг, конденсационная. Гарантия.", price: 22000, catId: "electronics", subId: "appliances", cond: "used" },
];

export const listings: Listing[] = seeds.map((s, i) => {
  const author = randomAuthor(s.bizAuthor);
  return {
    id: String(10001 + i),
    title: s.title,
    description: s.desc,
    price: s.price,
    currency: "₽",
    photos: getPhotos(s.subId),
    categoryId: s.catId,
    subcategoryId: s.subId,
    condition: s.cond,
    district: assignDistrict(i),
    address: "г. Нефтеюганск",
    authorName: author.name,
    authorType: author.type,
    authorPhone: author.phone,
    authorLogo: author.type === "business" ? undefined : undefined,
    authorDescription: author.description,
    authorRating: author.rating,
    authorVerified: author.verified,
    createdAt: randomDate(30),
    flags: flags(),
    vip: s.vip || false,
    promoted: Math.random() < 0.1,
    boost_district: Math.random() < 0.08,
    views: s.vip ? randomViews() + 300 : randomViews(),
    favorites: randomFavs(),
  };
});

export function getListingById(id: string): Listing | undefined {
  return listings.find(l => l.id === id);
}

export function getListingsByCategory(categoryId: string, subcategoryId?: string): Listing[] {
  return listings.filter(l => l.categoryId === categoryId && (!subcategoryId || l.subcategoryId === subcategoryId));
}

export function searchListings(query: string): Listing[] {
  const q = query.toLowerCase();
  return listings.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
}

export function filterListings(opts: {
  categoryId?: string;
  subcategoryId?: string;
  query?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: "new" | "used";
  authorType?: "private" | "business";
  district?: string;
  urgent?: boolean;
  bargain?: boolean;
  delivery?: boolean;
  vipOnly?: boolean;
  sortBy?: "date" | "price_asc" | "price_desc" | "popular";
}): Listing[] {
  let result = [...listings];

  if (opts.categoryId) result = result.filter(l => l.categoryId === opts.categoryId);
  if (opts.subcategoryId) result = result.filter(l => l.subcategoryId === opts.subcategoryId);
  if (opts.query) {
    const q = opts.query.toLowerCase();
    result = result.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }
  if (opts.priceMin !== undefined) result = result.filter(l => l.price >= opts.priceMin!);
  if (opts.priceMax !== undefined) result = result.filter(l => l.price <= opts.priceMax!);
  if (opts.condition) result = result.filter(l => l.condition === opts.condition);
  if (opts.authorType) result = result.filter(l => l.authorType === opts.authorType);
  if (opts.district) result = result.filter(l => l.district === opts.district);
  if (opts.urgent) result = result.filter(l => l.flags.urgent);
  if (opts.bargain) result = result.filter(l => l.flags.bargain);
  if (opts.delivery) result = result.filter(l => l.flags.delivery);
  if (opts.vipOnly) result = result.filter(l => l.vip);

  // VIP and boosted-district first, then promoted, then normal
  const vipListings = result.filter(l => l.vip);
  const boostedListings = result.filter(l => l.boost_district && !l.vip && opts.district);
  const promotedListings = result.filter(l => l.promoted && !l.vip && !(l.boost_district && opts.district));
  const normalListings = result.filter(l => !l.vip && !l.promoted && !(l.boost_district && opts.district));

  const sortFn = (a: Listing, b: Listing) => {
    switch (opts.sortBy) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "popular": return b.views - a.views;
      case "date":
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  };

  vipListings.sort(sortFn);
  boostedListings.sort(sortFn);
  promotedListings.sort(sortFn);
  normalListings.sort(sortFn);

  return [...vipListings, ...boostedListings, ...promotedListings, ...normalListings];
}
