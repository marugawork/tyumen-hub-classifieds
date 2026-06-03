import AdminLayout from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";
import { TrendingUp, Search, Target, LineChart, Sparkles, ShieldCheck, ShieldAlert, Megaphone } from "lucide-react";

const cards = [
  { to: "/admin/growth/analytics", icon: LineChart, title: "Growth Analytics", desc: "Метрики роста, активность по городу и категориям" },
  { to: "/admin/growth/recommendations", icon: Sparkles, title: "AI-рекомендации", desc: "Где нужен контент, где запускать кампании" },
  { to: "/admin/growth/empty-categories", icon: Search, title: "Пустые категории", desc: "Категории и районы без объявлений" },
  { to: "/admin/growth/trends", icon: TrendingUp, title: "Тренды категорий", desc: "Спрос, рост, падение по категориям" },
  { to: "/admin/growth/promotion-advisor", icon: Target, title: "Promotion Advisor", desc: "AI-подбор пакета продвижения" },
  { to: "/admin/growth/seed", icon: Sparkles, title: "AI Seed Generator", desc: "Генерация стартового контента" },
  { to: "/admin/ai-moderation", icon: ShieldCheck, title: "AI Moderation", desc: "Модерация контента и риск-скоринг" },
  { to: "/admin/anti-fraud", icon: ShieldAlert, title: "Anti-Fraud", desc: "Дубли, спам, фейк-продавцы" },
  { to: "/admin/ads", icon: Megaphone, title: "Кампании", desc: "Баннерные и рекламные размещения" },
];

export default function AdminGrowthCenter() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Growth Center</h1>
          <p className="text-sm text-muted-foreground">Единый центр AI-роста: аналитика, контент, монетизация, защита</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map(c => {
            const Icon = c.icon;
            return (
              <Link key={c.to} to={c.to}
                className="bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors">
                <Icon className="w-5 h-5 text-accent mb-3" />
                <div className="font-bold text-sm text-foreground">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
