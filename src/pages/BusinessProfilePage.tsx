import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, Star, ShieldCheck, MapPin, ExternalLink } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/listings";

export default function BusinessProfilePage() {
  const bizListings = listings.filter(l => l.authorType === "business").slice(0, 12);
  const bizName = bizListings[0]?.authorName || "Компания";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        {/* Business header */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl gradient-premium flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground">{bizName}</h1>
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-vip fill-vip" />
                  <span className="font-semibold">4.8</span>
                </div>
                <span>•</span>
                <span>{bizListings.length} объявлений</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Нефтеюганск</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Надёжная компания в Нефтеюганске. Работаем с 2015 года. Качественные товары и услуги с гарантией.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Рейтинг", value: "4.8 ★" },
              { label: "Объявлений", value: String(bizListings.length) },
              { label: "На сайте с", value: "2020 г." },
              { label: "Сделок", value: "156" },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-foreground mb-4">Объявления компании</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bizListings.map(l => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
