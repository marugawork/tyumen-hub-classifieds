import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Clock, Eye, Crown } from "lucide-react";
import { type Listing } from "@/data/listings";
import { useFavorites } from "@/hooks/useFavorites";
import { useDistrict } from "@/contexts/DistrictContext";
import { districtToSlug } from "@/data/districts";

function formatPrice(price: number, currency: string): string {
  if (price === 0) return "Бесплатно";
  return price.toLocaleString("ru-RU") + " " + currency;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  if (days < 7) return `${days} дн. назад`;
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export default function ListingCard({ listing, compact }: ListingCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { setSelectedDistrict } = useDistrict();
  const navigate = useNavigate();
  const fav = isFavorite(listing.id);
  const isVip = listing.vip;

  return (
    <div className={`group animate-fade-in ${isVip ? "listing-card-vip" : "listing-card"}`}>
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {isVip && <span className="badge-vip flex items-center gap-1"><Crown className="w-3 h-3" />VIP</span>}
            {listing.flags.urgent && <span className="badge-urgent">Срочно</span>}
            {listing.flags.bargain && <span className="badge-bargain">Торг</span>}
            {listing.flags.delivery && <span className="badge-delivery">Доставка</span>}
          </div>
          {/* Promoted badge */}
          {listing.promoted && !isVip && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-accent/90 text-accent-foreground text-[10px] font-bold uppercase">
              ТОП
            </div>
          )}
        </div>
      </Link>

      <div className={`p-3 ${compact ? "p-2.5" : "p-3"}`}>
        {/* Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={`font-extrabold text-lg leading-tight ${isVip ? "text-vip" : "text-foreground"}`}>
            {formatPrice(listing.price, listing.currency)}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(listing.id);
            }}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              fav ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            }`}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/listing/${listing.id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-accent transition-colors">
            {listing.title}
          </h3>
        </Link>

        {/* Meta */}
        <div className={`mt-2 flex flex-col gap-1 text-xs text-muted-foreground ${compact ? "mt-1.5" : ""}`}>
          <button
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              setSelectedDistrict(listing.district);
              navigate(`/district/${districtToSlug(listing.district)}`);
            }}
            className="flex items-center gap-1 hover:text-accent transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-muted-foreground"
          >
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{listing.district}, Нефтеюганск</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(listing.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{listing.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
