import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { tariffs as initialTariffs, type Tariff } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Check, X, Settings } from "lucide-react";

export default function AdminTariffs() {
  const [items, setItems] = useState(initialTariffs);
  const [editing, setEditing] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);

  const startEdit = (t: Tariff) => {
    setEditing(t.id);
    setEditPrice(t.price);
  };

  const saveEdit = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, price: editPrice } : t)));
    setEditing(null);
  };

  const toggleActive = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Настройки тарифов</h1>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {items.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground">{t.name}</p>
                {editing === t.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">{t.unit}</span>
                    <button onClick={() => saveEdit(t.id)} className="p-1 rounded bg-success/10 text-success"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setEditing(null)} className="p-1 rounded bg-destructive/10 text-destructive"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <p className="text-sm font-extrabold text-accent">{t.price} {t.unit}</p>
                )}
              </div>
              <Badge
                className={`text-[10px] cursor-pointer border-0 ${t.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                onClick={() => toggleActive(t.id)}
              >
                {t.active ? "Активен" : "Выключен"}
              </Badge>
              {editing !== t.id && (
                <button onClick={() => startEdit(t)} className="p-1.5 rounded-md hover:bg-muted">
                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
