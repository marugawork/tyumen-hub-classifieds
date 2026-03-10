import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockBanners, mockCampaigns, type MockBanner } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Eye, Pause, Play, Trash2, Edit, Image, BarChart3,
  Calendar, MapPin, Grid3X3, ExternalLink,
} from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  scheduled: "bg-primary/10 text-primary",
  expired: "bg-muted text-muted-foreground",
  paused: "bg-accent/10 text-accent",
  completed: "bg-muted text-muted-foreground",
};

export default function AdminAds() {
  const [tab, setTab] = useState<"banners" | "campaigns">("banners");
  const [banners, setBanners] = useState(mockBanners);

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "active" ? "paused" : "active" } as MockBanner
          : b
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">Реклама и баннеры</h1>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Создать баннер
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("banners")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "banners" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            Баннеры ({banners.length})
          </button>
          <button
            onClick={() => setTab("campaigns")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === "campaigns" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            Кампании ({mockCampaigns.length})
          </button>
        </div>

        {tab === "banners" && (
          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {b.type === "image" ? (
                      <Image className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground">{b.type === "direct" ? "CODE" : "HTML"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-foreground truncate">{b.title}</p>
                      <Badge className={`text-[10px] border-0 shrink-0 ${statusColors[b.status]}`}>
                        {b.status === "active" ? "Активен" : b.status === "scheduled" ? "Запланирован" : b.status === "paused" ? "Пауза" : "Истёк"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{b.advertiser}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.startDate} — {b.endDate}</span>
                      <span>{b.placement} • {b.page}</span>
                      <span>{b.size}</span>
                      {b.district && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.district}</span>}
                      {b.category && <span className="flex items-center gap-1"><Grid3X3 className="w-3 h-3" />{b.category}</span>}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-muted-foreground">Показы: <strong className="text-foreground">{b.impressions.toLocaleString("ru")}</strong></span>
                      <span className="text-muted-foreground">Клики: <strong className="text-foreground">{b.clicks.toLocaleString("ru")}</strong></span>
                      <span className="text-muted-foreground">CTR: <strong className="text-foreground">{b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(1) : 0}%</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggleBannerStatus(b.id)}
                      className="p-1.5 rounded-md hover:bg-muted"
                      title={b.status === "active" ? "Приостановить" : "Запустить"}
                    >
                      {b.status === "active" ? <Pause className="w-3.5 h-3.5 text-accent" /> : <Play className="w-3.5 h-3.5 text-success" />}
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-muted" title="Редактировать"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-md hover:bg-muted" title="Статистика"><BarChart3 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-md hover:bg-destructive/10" title="Удалить"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "campaigns" && (
          <div className="space-y-3">
            {mockCampaigns.map((c) => (
              <div key={c.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-foreground">{c.name}</p>
                      <Badge className={`text-[10px] border-0 ${statusColors[c.status]}`}>
                        {c.status === "active" ? "Активна" : c.status === "paused" ? "Пауза" : "Завершена"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{c.advertiser}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.startDate} — {c.endDate}</span>
                      <span>Бюджет: <strong className="text-foreground">{c.budget.toLocaleString("ru")} ₽</strong></span>
                      <span>Потрачено: <strong className="text-foreground">{c.spent.toLocaleString("ru")} ₽</strong></span>
                    </div>
                    {(c.districts.length > 0 || c.categories.length > 0) && (
                      <div className="flex gap-2 mt-2">
                        {c.districts.map((d) => (
                          <Badge key={d} variant="secondary" className="text-[10px]"><MapPin className="w-3 h-3 mr-0.5" />{d}</Badge>
                        ))}
                        {c.categories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-[10px]"><Grid3X3 className="w-3 h-3 mr-0.5" />{cat}</Badge>
                        ))}
                      </div>
                    )}
                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
