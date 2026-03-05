import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Crown, TrendingUp, Zap, Eye, Heart, Phone, ArrowUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { listings, type Listing, type PromotionType } from "@/data/listings";

function formatPrice(price: number): string {
  if (price === 0) return "Бесплатно";
  return price.toLocaleString("ru-RU") + " ₽";
}

function promotionBadge(l: Listing) {
  const endDate = l.promotion_end ? new Date(l.promotion_end).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) : "";

  switch (l.promotion_type) {
    case "vip":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-vip/10 text-vip text-xs font-bold">
          <Crown className="w-3 h-3" />
          VIP до {endDate}
        </div>
      );
    case "top":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          TOP до {endDate}
        </div>
      );
    case "urgent":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-bold">
          <Zap className="w-3 h-3" />
          Срочно до {endDate}
        </div>
      );
    case "raise":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-foreground text-xs font-bold">
          <ArrowUp className="w-3 h-3" />
          Поднятие до {endDate}
        </div>
      );
    default:
      return <span className="text-xs text-muted-foreground">Без продвижения</span>;
  }
}

export default function MyListingsPage() {
  // Mock: show first 15 listings as "my" listings  
  const myListings = useMemo(() => listings.slice(0, 15), []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={[{ label: "Мои объявления" }]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Мои объявления</h1>

        <div className="space-y-3">
          {myListings.map(l => (
            <div key={l.id} className={`bg-card rounded-xl border ${l.vip ? "border-vip" : "border-border"} p-4 flex gap-4 items-start`}>
              <Link to={`/listing/${l.id}`} className="shrink-0">
                <img src={l.photos[0]} alt="" className="w-24 h-18 object-cover rounded-lg" />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/listing/${l.id}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
                  {l.title}
                </Link>
                <p className="text-sm font-extrabold text-foreground mt-0.5">{formatPrice(l.price)}</p>
                <p className="text-xs text-muted-foreground mt-1">{l.district}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{l.favorites}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.contacts || 0}</span>
                </div>
              </div>

              {/* Promotion status */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                {promotionBadge(l)}
                {l.auto_raise && (
                  <span className="text-[10px] text-success font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />Автоподнятие
                  </span>
                )}
                {!l.promotion_type && (
                  <Link
                    to={`/promote/${l.id}`}
                    className="px-3 py-1.5 rounded-lg bg-vip/10 text-vip text-xs font-bold hover:bg-vip/20 transition-colors flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3" />
                    Продвинуть
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
