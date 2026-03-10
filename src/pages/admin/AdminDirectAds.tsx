import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockBanners } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Code, Play, Pause, Trash2, Eye, Calendar } from "lucide-react";

export default function AdminDirectAds() {
  const directBanners = mockBanners.filter((b) => b.type === "direct" || b.type === "html");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    advertiser: "",
    placement: "",
    htmlCode: "",
    district: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">Direct / код рекламы</h1>
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> Добавить код
          </Button>
        </div>

        {showForm && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h3 className="font-bold text-sm text-foreground">Новый рекламный код</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Название</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Яндекс.Директ блок" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Рекламодатель</label>
                <Input value={formData.advertiser} onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })} placeholder="Яндекс" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Место показа</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={formData.placement} onChange={(e) => setFormData({ ...formData, placement: e.target.value })}>
                  <option value="">Выберите...</option>
                  <option value="sidebar">Сайдбар</option>
                  <option value="top">Верхний баннер</option>
                  <option value="feed">В ленте</option>
                  <option value="listing">В карточке объявления</option>
                  <option value="between">Между блоками</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Район (необязательно)</label>
                <Input value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} placeholder="Все районы" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Дата начала</label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Дата окончания</label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Рекламный код (HTML / Script)</label>
              <textarea
                value={formData.htmlCode}
                onChange={(e) => setFormData({ ...formData, htmlCode: e.target.value })}
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="<!-- Вставьте рекламный код -->"
              />
            </div>
            {formData.htmlCode && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Предпросмотр:</p>
                <div className="border border-border rounded-lg p-4 bg-muted/30 text-xs text-muted-foreground italic">
                  Код будет безопасно отрендерен в iframe на сайте
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm">Сохранить</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {directBanners.map((b) => (
            <div key={b.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Code className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm text-foreground">{b.title}</p>
                  <Badge className={`text-[10px] border-0 ${b.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {b.status === "active" ? "Активен" : "Неактивен"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{b.advertiser}</span>
                  <span>{b.placement}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.startDate} — {b.endDate}</span>
                  <span>Показы: {b.impressions.toLocaleString("ru")}</span>
                  <span>Клики: {b.clicks.toLocaleString("ru")}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 rounded-md hover:bg-muted">
                  {b.status === "active" ? <Pause className="w-3.5 h-3.5 text-accent" /> : <Play className="w-3.5 h-3.5 text-success" />}
                </button>
                <button className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            </div>
          ))}

          {directBanners.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Code className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Нет активных direct-размещений</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
