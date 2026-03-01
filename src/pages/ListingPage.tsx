import { useParams, Link } from "react-router-dom";
import { Heart, Flag, MapPin, Eye, Clock, Crown, Share2, Copy, Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ListingGallery from "@/components/ListingGallery";
import SellerCard from "@/components/SellerCard";
import ListingCard from "@/components/ListingCard";
import AdBanner from "@/components/AdBanner";
import { getListingById, listings } from "@/data/listings";
import { getCategoryById, getSubcategory } from "@/data/categories";
import { useFavorites } from "@/hooks/useFavorites";
import { useDistrict } from "@/contexts/DistrictContext";
import { districtToSlug } from "@/data/districts";
import { toast } from "@/hooks/use-toast";

function formatPrice(price: number, currency: string): string {
  if (price === 0) return "Бесплатно";
  return price.toLocaleString("ru-RU") + " " + currency;
}

function districtFullLabel(d: string): string {
  const m = d.match(/^(\d+)\s*мкр$/);
  if (m) return `${m[1]} микрорайон`;
  return d;
}

export default function ListingPage() {
  const { id } = useParams();
  const listing = id ? getListingById(id) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { setSelectedDistrict } = useDistrict();
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-main py-20 text-center text-muted-foreground">
          <p className="text-xl">Объявление не найдено</p>
          <Link to="/" className="text-accent mt-4 inline-block font-semibold">На главную</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = getCategoryById(listing.categoryId);
  const subcategory = category ? getSubcategory(listing.categoryId, listing.subcategoryId) : undefined;
  const fav = isFavorite(listing.id);
  const isVip = listing.vip;
  const dLabel = districtFullLabel(listing.district);
  const dSlug = districtToSlug(listing.district);

  // Similar in same district first, then by category
  const districtListings = listings
    .filter(l => l.district === listing.district && l.id !== listing.id && l.categoryId === listing.categoryId)
    .slice(0, 4);

  const similarListings = listings
    .filter(l => l.categoryId === listing.categoryId && l.id !== listing.id && l.district !== listing.district)
    .slice(0, 4);

  const crumbs: Array<{ label: string; href?: string }> = [{ label: "Нефтеюганск", href: "/" }];
  crumbs.push({ label: dLabel, href: `/district/${dSlug}` });
  if (category) {
    crumbs.push({ label: category.name, href: `/category/${category.slug}` });
    if (subcategory) crumbs.push({ label: subcategory.name, href: `/category/${category.slug}/${subcategory.slug}` });
  }
  crumbs.push({ label: listing.title });

  const createdDate = new Date(listing.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const updatedDate = new Date(new Date(listing.createdAt).getTime() + 86400000 * 2).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast({ title: "Ссылка скопирована", description: "Ссылка на объявление скопирована в буфер обмена" });
    setShowShare(false);
  };

  const sellerListingsCount = listings.filter(l => l.authorName === listing.authorName).length;

  const handleDistrictClick = () => {
    setSelectedDistrict(listing.district);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={crumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ListingGallery photos={listing.photos} title={listing.title} />

            {/* Ad banner under gallery */}
            <AdBanner format="horizontal" />

            {/* Title + Price */}
            <div className={`${isVip ? "bg-card rounded-2xl border-2 border-vip p-6 animate-vip-glow" : ""}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {isVip && <span className="badge-vip flex items-center gap-1"><Crown className="w-3 h-3" />VIP</span>}
                {listing.flags.urgent && <span className="badge-urgent">Срочно</span>}
                {listing.flags.bargain && <span className="badge-bargain">Торг</span>}
                {listing.flags.delivery && <span className="badge-delivery">Доставка</span>}
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-secondary text-secondary-foreground uppercase">
                  {listing.condition === "new" ? "Новое" : "Б/у"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">{listing.title}</h1>
              <p className={`text-3xl font-black ${isVip ? "text-vip" : "text-accent"}`}>{formatPrice(listing.price, listing.currency)}</p>
            </div>

            {/* District badge */}
            <div className="flex items-center gap-2">
              <Link
                to={`/district/${dSlug}`}
                onClick={handleDistrictClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {dLabel}, Нефтеюганск
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => toggleFavorite(listing.id)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 transition-colors text-sm font-bold ${
                  fav ? "border-destructive text-destructive bg-destructive/5" : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                }`}
              >
                <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                {fav ? "В избранном" : "В избранное"}
              </button>
              <button
                onClick={() => setShowShare(!showShare)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Поделиться
              </button>
              <button
                onClick={() => setShowReport(!showReport)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                <Flag className="w-4 h-4" />
                Пожаловаться
              </button>
              {!isVip && (
                <Link to={`/promote/${listing.id}`} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-vip/10 text-vip border-2 border-vip/30 hover:bg-vip/20 transition-colors text-sm font-bold">
                  <Crown className="w-4 h-4" />
                  Продвинуть
                </Link>
              )}
            </div>

            {/* Share panel */}
            {showShare && (
              <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
                <h3 className="font-bold text-foreground mb-3">Поделиться</h3>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(listing.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#2AABEE]/10 text-[#2AABEE] text-sm font-semibold hover:bg-[#2AABEE]/20 transition-colors"
                  >
                    Telegram
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(listing.title + " " + currentUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#25D366]/10 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Скопировать ссылку
                  </button>
                </div>
              </div>
            )}

            {/* Report panel */}
            {showReport && (
              <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
                <h3 className="font-bold text-foreground mb-3">Причина жалобы</h3>
                <div className="space-y-1">
                  {["Мошенничество", "Запрещённый товар", "Неактуальное", "Неверная категория", "Другое"].map(reason => (
                    <button key={reason} onClick={() => { setShowReport(false); toast({ title: "Жалоба отправлена", description: `Причина: ${reason}` }); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-extrabold text-foreground mb-3">Описание</h2>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Ad between description and characteristics */}
            <AdBanner format="inline" />

            {/* Characteristics */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-extrabold text-foreground mb-3">Характеристики</h2>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">Категория</span>
                <span className="text-foreground font-medium">{category?.name}</span>
                {subcategory && (<><span className="text-muted-foreground">Подкатегория</span><span className="text-foreground font-medium">{subcategory.name}</span></>)}
                <span className="text-muted-foreground">Состояние</span>
                <span className="text-foreground font-medium">{listing.condition === "new" ? "Новое" : "Б/у"}</span>
                <span className="text-muted-foreground">Продавец</span>
                <span className="text-foreground font-medium">{listing.authorType === "business" ? "Компания" : "Частное лицо"}</span>
                <span className="text-muted-foreground">Район</span>
                <Link to={`/district/${dSlug}`} onClick={handleDistrictClick} className="text-accent font-medium hover:underline">{dLabel}</Link>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-extrabold text-foreground mb-3">Местоположение</h2>
              <div className="flex items-center gap-2 text-sm text-foreground mb-3">
                <MapPin className="w-4 h-4 text-accent" />
                <Link to={`/district/${dSlug}`} onClick={handleDistrictClick} className="hover:text-accent transition-colors">
                  {dLabel}, г. Нефтеюганск
                </Link>
              </div>
              <div className="aspect-[2/1] rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 mr-2" />
                Карта: {dLabel}, Нефтеюганск
              </div>
            </div>

            {/* Ad under map */}
            <AdBanner format="sidebar" />

            {/* Mini stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-extrabold text-foreground mb-3">Статистика объявления</h2>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Опубликовано
                </div>
                <span className="text-foreground font-medium">{createdDate}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4" />
                  Обновлено
                </div>
                <span className="text-foreground font-medium">{updatedDate}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Просмотров
                </div>
                <span className="text-foreground font-medium">{listing.views}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  В избранном
                </div>
                <span className="text-foreground font-medium">{listing.favorites}</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">ID: {listing.id}</div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <SellerCard
              name={listing.authorName}
              type={listing.authorType}
              phone={listing.authorPhone}
              rating={listing.authorRating}
              verified={listing.authorVerified}
              description={listing.authorDescription}
              listingsCount={sellerListingsCount}
              registeredDate="Март 2023"
            />
            <AdBanner format="vip" />
          </div>
        </div>

        {/* Ad before similar */}
        <div className="mt-8">
          <AdBanner format="horizontal" />
        </div>

        {districtListings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Похожие в {dLabel}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {districtListings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}

        {similarListings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-foreground mb-4">Похожие по городу</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarListings.map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
