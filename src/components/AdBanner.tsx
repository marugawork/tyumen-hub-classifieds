import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  description: string;
  businessName: string;
  phone?: string;
  bgColor: string;
  accentColor: string;
  emoji: string;
}

const mockAds: Record<string, Ad[]> = {
  horizontal: [
    {
      id: "ad-auto",
      title: "Автосервис «Мотор-Плюс»",
      description: "Ремонт любой сложности. Диагностика бесплатно!",
      businessName: "Мотор-Плюс",
      phone: "+7 (3463) 25-55-55",
      bgColor: "from-primary/5 to-primary/10",
      accentColor: "text-primary",
      emoji: "🔧",
    },
  ],
  sidebar: [
    {
      id: "ad-realty",
      title: "Агентство «Ваш Дом»",
      description: "Квартиры от застройщика. Ипотека от 0.1%",
      businessName: "Ваш Дом",
      phone: "+7 (3463) 30-00-30",
      bgColor: "from-success/5 to-success/10",
      accentColor: "text-success",
      emoji: "🏠",
    },
  ],
  inline: [
    {
      id: "ad-stroy",
      title: "Магазин «СтройМастер»",
      description: "Стройматериалы по оптовым ценам. Доставка по городу!",
      businessName: "СтройМастер",
      phone: "+7 (3463) 44-44-44",
      bgColor: "from-accent/5 to-accent/10",
      accentColor: "text-accent",
      emoji: "🧱",
    },
  ],
  vip: [
    {
      id: "ad-phone",
      title: "Ремонт телефонов «FixMe»",
      description: "Замена экрана за 30 минут. Гарантия 6 мес.",
      businessName: "FixMe",
      phone: "+7 (3463) 77-77-77",
      bgColor: "from-primary/5 to-primary/10",
      accentColor: "text-primary",
      emoji: "📱",
    },
  ],
};

type AdFormat = "horizontal" | "sidebar" | "inline" | "vip";

interface AdBannerProps {
  format: AdFormat;
  className?: string;
}

export default function AdBanner({ format, className = "" }: AdBannerProps) {
  const ads = mockAds[format];
  if (!ads || ads.length === 0) return null;
  const ad = ads[0];

  if (format === "horizontal") {
    return (
      <div className={`bg-gradient-to-r ${ad.bgColor} border border-border rounded-2xl p-5 md:p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{ad.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className={`font-bold text-sm ${ad.accentColor}`}>{ad.title}</h4>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">Реклама</span>
              </div>
              <p className="text-sm text-foreground">{ad.description}</p>
              {ad.phone && <p className="text-xs text-muted-foreground mt-1">{ad.phone}</p>}
            </div>
          </div>
          <button className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors shrink-0">
            Подробнее <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (format === "sidebar") {
    return (
      <div className={`bg-gradient-to-b ${ad.bgColor} border border-border rounded-2xl p-5 ${className}`}>
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">Реклама</span>
        <div className="text-center mt-3">
          <span className="text-4xl block mb-3">{ad.emoji}</span>
          <h4 className={`font-bold text-sm ${ad.accentColor} mb-1`}>{ad.title}</h4>
          <p className="text-xs text-foreground mb-2">{ad.description}</p>
          {ad.phone && <p className="text-xs text-muted-foreground mb-3">{ad.phone}</p>}
          <button className="w-full px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
            Подробнее
          </button>
        </div>
      </div>
    );
  }

  if (format === "inline") {
    return (
      <div className={`bg-gradient-to-r ${ad.bgColor} border border-border rounded-2xl p-4 md:p-5 ${className}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ad.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={`font-bold text-sm ${ad.accentColor} truncate`}>{ad.title}</h4>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium shrink-0">Реклама</span>
            </div>
            <p className="text-xs text-foreground">{ad.description}</p>
          </div>
          <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors shrink-0">
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // vip format
  return (
    <div className={`bg-gradient-to-r ${ad.bgColor} border border-border rounded-xl p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{ad.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold text-xs ${ad.accentColor} truncate`}>{ad.businessName}</span>
            <span className="text-[9px] text-muted-foreground bg-muted px-1 py-0.5 rounded">Реклама</span>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{ad.description}</p>
        </div>
      </div>
    </div>
  );
}
