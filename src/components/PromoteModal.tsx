import { useState } from "react";
import { Crown, TrendingUp, Zap, ArrowUp, X, MapPin } from "lucide-react";
import { type Listing } from "@/data/listings";
import { districts } from "@/data/districts";
import { toast } from "@/hooks/use-toast";

interface PromoteModalProps {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}

const tariffs = [
  {
    id: "raise",
    name: "Поднятие",
    price: 49,
    icon: ArrowUp,
    color: "text-foreground",
    bg: "bg-muted",
    border: "border-border",
    desc: "Объявление поднимается вверх списка. Автоподнятие каждые 24 часа.",
  },
  {
    id: "top",
    name: "TOP",
    price: 99,
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/5",
    border: "border-accent/30",
    desc: "Бейдж ТОП, попадает в ленту чаще, выше обычных объявлений.",
  },
  {
    id: "vip",
    name: "VIP",
    price: 199,
    icon: Crown,
    color: "text-vip",
    bg: "bg-vip/5",
    border: "border-vip/30",
    desc: "Золотая рамка, бейдж VIP, закрепление вверху категории и района.",
  },
  {
    id: "vip-district",
    name: "VIP район",
    price: 299,
    icon: MapPin,
    color: "text-vip",
    bg: "bg-vip/5",
    border: "border-vip/30",
    desc: "VIP + закрепление в конкретном микрорайоне. Максимальная видимость.",
  },
];

const durations = [
  { days: 3, label: "3 дня", mult: 1 },
  { days: 7, label: "7 дней", mult: 2 },
  { days: 14, label: "14 дней", mult: 3.5 },
  { days: 30, label: "30 дней", mult: 6 },
];

export default function PromoteModal({ listing, open, onClose }: PromoteModalProps) {
  const [selectedTariff, setSelectedTariff] = useState("top");
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [selectedDistrict, setSelectedDistrict] = useState(listing.district);

  if (!open) return null;

  const tariff = tariffs.find(t => t.id === selectedTariff)!;
  const duration = durations.find(d => d.days === selectedDuration)!;
  const totalPrice = Math.round(tariff.price * duration.mult);
  const isDistrictTariff = selectedTariff === "vip-district";

  const handlePurchase = () => {
    toast({
      title: "Продвижение активировано!",
      description: `${tariff.name} на ${duration.label} — ${totalPrice} ₽`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-foreground">⭐ Продвинуть объявление</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Listing preview */}
          <div className="bg-muted rounded-xl p-3 mb-6 flex items-center gap-3">
            <img src={listing.photos[0]} alt="" className="w-16 h-12 object-cover rounded-lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{listing.title}</p>
              <p className="text-xs text-muted-foreground">{listing.price > 0 ? `${listing.price.toLocaleString("ru-RU")} ₽` : "Бесплатно"}</p>
            </div>
          </div>

          {/* Tariff selection */}
          <h3 className="text-sm font-bold text-foreground mb-3">Выберите тариф</h3>
          <div className="space-y-2 mb-6">
            {tariffs.map(t => {
              const Icon = t.icon;
              const active = selectedTariff === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTariff(t.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    active ? `${t.border} ${t.bg}` : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${t.color}`} />
                      <span className={`font-bold text-sm ${active ? t.color : "text-foreground"}`}>{t.name}</span>
                    </div>
                    <span className="font-extrabold text-foreground">{t.price} ₽</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </button>
              );
            })}
          </div>

          {/* District selector for VIP район */}
          {isDistrictTariff && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-foreground mb-2">Район продвижения</h3>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {/* Duration */}
          <h3 className="text-sm font-bold text-foreground mb-3">Срок</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {durations.map(d => (
              <button
                key={d.days}
                onClick={() => setSelectedDuration(d.days)}
                className={`px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  selectedDuration === d.days
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-border text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Auto-raise info */}
          {(selectedTariff === "vip" || selectedTariff === "vip-district" || selectedTariff === "raise") && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-3 mb-6">
              <p className="text-xs text-success font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Автоподнятие каждые 24 часа включено
              </p>
            </div>
          )}

          {/* Total */}
          <div className="bg-muted rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="text-2xl font-black text-foreground">{totalPrice} ₽</span>
            </div>
          </div>

          {/* Purchase button */}
          <button
            onClick={handlePurchase}
            className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors"
          >
            Оплатить {totalPrice} ₽
          </button>
        </div>
      </div>
    </div>
  );
}
