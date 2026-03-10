import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { moderationItems, type ModerationItem } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Ban, AlertTriangle, FileText, Copy, ImageOff, MessageSquareWarning } from "lucide-react";

const typeConfig: Record<ModerationItem["type"], { label: string; icon: React.ElementType; color: string }> = {
  new: { label: "Новое", icon: FileText, color: "bg-primary/10 text-primary" },
  complaint: { label: "Жалоба", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
  suspicious: { label: "Подозрительное", icon: MessageSquareWarning, color: "bg-accent/10 text-accent" },
  duplicate: { label: "Дубль", icon: Copy, color: "bg-muted text-muted-foreground" },
  "no-photo": { label: "Без фото", icon: ImageOff, color: "bg-muted text-muted-foreground" },
  "banned-words": { label: "Запрещ. слова", icon: Ban, color: "bg-destructive/10 text-destructive" },
};

export default function AdminModeration() {
  const [items, setItems] = useState(moderationItems);
  const [filter, setFilter] = useState<string>("");

  const filtered = filter ? items.filter((i) => i.type === filter) : items;

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Модерация ({items.length})</h1>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Все ({items.length})
          </button>
          {(Object.keys(typeConfig) as ModerationItem["type"][]).map((t) => {
            const count = items.filter((i) => i.type === t).length;
            if (count === 0) return null;
            const cfg = typeConfig[t];
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <cfg.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{item.listingTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.author} • {item.district} • {item.date}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                </div>
                <Badge className={`text-[10px] ${cfg.color} border-0 shrink-0`}>{cfg.label}</Badge>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                    title="Одобрить"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Отклонить"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" title="Просмотр">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" title="Заблокировать автора">
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Check className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Все объявления проверены</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
