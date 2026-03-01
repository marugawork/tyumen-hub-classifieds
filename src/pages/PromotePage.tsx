import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getListingById } from "@/data/listings";
import { Crown, Zap, Pin, Palette, Check } from "lucide-react";

export default function PromotePage() {
  const { id } = useParams();
  const listing = id ? getListingById(id) : undefined;

  const options = [
    { id: "boost", name: "Поднятие", price: "99 ₽", icon: Zap, desc: "Поднять на 1-е место на 24 часа" },
    { id: "vip", name: "VIP", price: "299 ₽", icon: Crown, desc: "Золотая рамка + закрепление на 7 дней", popular: true },
    { id: "pin", name: "Закрепление", price: "199 ₽", icon: Pin, desc: "Закрепить вверху на 7 дней" },
    { id: "color", name: "Выделение", price: "49 ₽", icon: Palette, desc: "Цветной фон на 3 дня" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Продвижение объявления</h1>
        {listing && (
          <div className="bg-card rounded-xl border border-border p-4 flex gap-3 mb-6">
            <img src={listing.photos[0]} alt="" className="w-20 h-16 rounded-lg object-cover" />
            <div>
              <p className="font-bold text-sm text-foreground">{listing.title}</p>
              <p className="text-accent font-extrabold">{listing.price.toLocaleString("ru-RU")} ₽</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {options.map(opt => (
            <div key={opt.id} className={`bg-card rounded-xl border p-5 flex items-center gap-4 ${opt.popular ? "border-vip" : "border-border"}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.popular ? "bg-vip/10" : "bg-muted"}`}>
                <opt.icon className={`w-6 h-6 ${opt.popular ? "text-vip" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">{opt.name}</h3>
                  {opt.popular && <span className="badge-vip text-[9px] px-1.5 py-0">Хит</span>}
                </div>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-foreground">{opt.price}</p>
                <Link to="/payment" className="text-xs text-accent font-bold hover:text-accent/80">Выбрать</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
