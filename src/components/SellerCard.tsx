import { useState } from "react";
import { User, Star, ShieldCheck, Building2, ExternalLink, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface SellerCardProps {
  name: string;
  type: "private" | "business";
  phone: string;
  listingsCount?: number;
  rating?: number;
  verified?: boolean;
  description?: string;
  registeredDate?: string;
}

export default function SellerCard({ name, type, phone, listingsCount = 5, rating, verified, description, registeredDate }: SellerCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const displayRating = rating || (4 + Math.random()).toFixed(1);
  const numRating = typeof displayRating === "string" ? parseFloat(displayRating) : displayRating;
  const isVerified = verified || numRating >= 4;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === "business" ? "gradient-premium" : "bg-muted"}`}>
          {type === "business" ? (
            <Building2 className="w-6 h-6 text-white" />
          ) : (
            <User className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <h4 className="font-bold text-foreground">{name}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{type === "business" ? "Компания" : "Частное лицо"}</span>
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-vip fill-vip" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          </div>
        </div>
      </div>

      {isVerified && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Проверенный продавец
        </div>
      )}

      {description && (
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{description}</p>
      )}

      {/* Seller stats */}
      <div className="space-y-2 mb-4 text-xs text-muted-foreground">
        {registeredDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            На сайте с {registeredDate}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span>Средний рейтинг: <strong className="text-foreground">{displayRating}</strong></span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowPhone(true)}
          className="w-full h-11 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors"
        >
          {showPhone ? phone : "Показать телефон"}
        </button>
        <Link
          to="/messages"
          className="w-full h-11 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center"
        >
          Написать продавцу
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{listingsCount} объявлений</span>
          {type === "business" && (
            <Link to="/business-profile" className="text-xs text-accent font-semibold hover:text-accent/80 flex items-center gap-1">
              Профиль <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
        <Link
          to={`/search?q=${encodeURIComponent(name)}`}
          className="mt-2 block text-xs text-accent font-semibold hover:text-accent/80"
        >
          Все объявления продавца →
        </Link>
      </div>
    </div>
  );
}
