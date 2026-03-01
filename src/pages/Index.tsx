import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, TrendingUp, Shield, ChevronRight, Crown, MapPin } from "lucide-react";
import { useDistrict } from "@/contexts/DistrictContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";
import ListingCard from "@/components/ListingCard";
import AdBanner from "@/components/AdBanner";
import { listings, filterListings } from "@/data/listings";
import { districts, districtToSlug } from "@/data/districts";
import { useState } from "react";

export default function Index() {
  const { selectedDistrict, setSelectedDistrict, districtLabel } = useDistrict();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredListings = useMemo(
    () => selectedDistrict ? filterListings({ district: selectedDistrict, sortBy: "date" }) : listings,
    [selectedDistrict]
  );

  const vipListings = useMemo(
    () => filteredListings.filter(l => l.vip).slice(0, 4),
    [filteredListings]
  );
  const popularListings = useMemo(
    () => [...filteredListings].sort((a, b) => b.views - a.views).slice(0, 8),
    [filteredListings]
  );
  const newListings = useMemo(
    () => [...filteredListings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [filteredListings]
  );

  const districtPopular = useMemo(
    () => selectedDistrict
      ? [...filteredListings].sort((a, b) => b.views - a.views).slice(0, 4)
      : [],
    [selectedDistrict, filteredListings]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedDistrict) params.set("district", districtToSlug(selectedDistrict));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search block */}
      <section className="py-10 md:py-14">
        <div className="container-main">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Что ищете? Например: квартира, iPhone, автомобиль..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 h-14 md:h-16 px-6 rounded-l-2xl border border-r-0 border-input bg-card text-base md:text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            <div className="relative h-14 md:h-16 shrink-0">
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="h-full appearance-none bg-card border border-r-0 border-input pl-9 pr-8 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              >
                <option value="">Все районы</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronRight className="w-3 h-3 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="h-14 md:h-16 px-8 md:px-10 rounded-r-2xl bg-accent text-accent-foreground font-bold text-base md:text-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden sm:inline">Найти</span>
            </button>
          </form>

          {/* District link when selected */}
          {selectedDistrict && (
            <div className="mt-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground font-medium">{districtLabel}</span>
              <Link
                to={`/district/${districtToSlug(selectedDistrict)}`}
                className="text-xs text-accent font-semibold hover:text-accent/80 transition-colors flex items-center gap-1"
              >
                Все в {districtLabel} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Mini banners row */}
      <section className="pb-8">
        <div className="container-main">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { emoji: "🔧", title: "Автосервис «Мотор+»", desc: "Диагностика бесплатно", bg: "from-blue-50 to-blue-100/50" },
              { emoji: "🏠", title: "АН «Ваш Дом»", desc: "Квартиры от 2.1 млн", bg: "from-emerald-50 to-emerald-100/50" },
              { emoji: "🧱", title: "СтройМастер", desc: "Доставка по городу", bg: "from-amber-50 to-amber-100/50" },
              { emoji: "📱", title: "FixMe Ремонт", desc: "Экран за 30 мин", bg: "from-violet-50 to-violet-100/50" },
              { emoji: "🛋️", title: "Мебель «Комфорт»", desc: "Скидки до 30%", bg: "from-rose-50 to-rose-100/50" },
            ].map((b, i) => (
              <button key={i} className={`bg-gradient-to-br ${b.bg} rounded-xl p-3 text-left hover:shadow-md transition-shadow border border-border/50 group`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{b.emoji}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted/80 px-1 py-0.5 rounded">Реклама</span>
                </div>
                <h4 className="text-xs font-bold text-foreground truncate">{b.title}</h4>
                <p className="text-[11px] text-muted-foreground truncate">{b.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top ad */}
      <div className="container-main pt-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Categories */}
      <section className="container-main py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-foreground">Категории</h2>
          <Link to="/categories" className="text-sm text-accent font-semibold hover:text-accent/80 transition-colors flex items-center gap-1">
            Все категории <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Popular in district */}
      {selectedDistrict && districtPopular.length > 0 && (
        <section className="container-main pb-12">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-extrabold text-foreground">Популярное в {districtLabel}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {districtPopular.map(l => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to={`/district/${districtToSlug(selectedDistrict)}`}
              className="text-sm text-accent font-semibold hover:text-accent/80 transition-colors"
            >
              Все объявления в {districtLabel} →
            </Link>
          </div>
        </section>
      )}

      {/* VIP + sidebar ad */}
      {vipListings.length > 0 && (
        <section className="container-main pb-12">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-5 h-5 text-vip" />
            <h2 className="text-2xl font-extrabold text-foreground">
              VIP объявления{districtLabel ? ` — ${districtLabel}` : ""}
            </h2>
          </div>
          <div className="flex gap-6">
            <div className="hidden lg:block w-48 shrink-0">
              <AdBanner format="sidebar" />
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {vipListings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
            <div className="hidden lg:block w-48 shrink-0">
              <AdBanner format="vip" />
            </div>
          </div>
        </section>
      )}

      {/* Inline ad */}
      <div className="container-main pb-8">
        <AdBanner format="inline" />
      </div>

      {/* Popular */}
      <section className="container-main pb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-extrabold text-foreground">
            {districtLabel ? `Популярное — ${districtLabel}` : "Популярное"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularListings.map(l => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* New */}
      <section className="container-main pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-foreground">
            {districtLabel ? `Новые объявления — ${districtLabel}` : "Новые объявления"}
          </h2>
          <Link to="/search" className="text-sm text-accent font-semibold hover:text-accent/80 transition-colors flex items-center gap-1">
            Смотреть все <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newListings.map(l => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Inline ad before promo */}
      <div className="container-main pb-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Monetization banner */}
      <section className="container-main pb-12">
        <div className="gradient-premium rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-vip" />
              <span className="text-vip font-bold text-sm uppercase tracking-wider">Продвижение</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3">Продавайте быстрее с VIP</h3>
            <p className="text-white/70 mb-6 max-w-lg">
              Выделите объявление золотой рамкой, поднимите в поиске или закрепите на 7 дней. До 5x больше просмотров.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/pricing" className="px-6 py-3 rounded-xl bg-vip text-foreground font-bold text-sm hover:bg-vip/90 transition-colors">
                Узнать тарифы
              </Link>
              <Link to="/create" className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors border border-white/20">
                Разместить объявление
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="container-main pb-12">
        <div className="bg-card rounded-2xl border border-border p-8 md:p-10 flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground mb-2">Безопасность сделок</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Мы заботимся о вашей безопасности. Проверяйте продавца, общайтесь через встроенный чат, не переводите предоплату незнакомым.
            </p>
            <Link to="/help" className="text-sm text-accent font-semibold hover:text-accent/80 transition-colors">
              Узнать больше о безопасности →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
