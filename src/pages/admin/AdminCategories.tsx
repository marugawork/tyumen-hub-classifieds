import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { categories } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Eye, EyeOff, Edit, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";

export default function AdminCategories() {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) => {
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">Категории ({categories.length})</h1>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {categories.map((cat, i) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 p-3 border-b border-border hover:bg-muted/20 transition-colors">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `hsl(var(--${cat.colorVar}) / 0.15)`, color: `hsl(var(--${cat.colorVar}))` }}
                >
                  <cat.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <button onClick={() => toggle(cat.id)} className="flex items-center gap-1 font-bold text-sm text-foreground">
                    {cat.subcategories.length > 0 && (
                      expanded.includes(cat.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                    )}
                    {cat.name}
                  </button>
                  <p className="text-xs text-muted-foreground">{cat.subcategories.length} подкатегорий</p>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0">#{i + 1}</Badge>
                <div className="flex gap-1 shrink-0">
                  <button className="p-1.5 rounded-md hover:bg-muted" title="Редактировать"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded-md hover:bg-muted" title="Скрыть"><EyeOff className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded-md hover:bg-destructive/10" title="Удалить"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </div>

              {/* Subcategories */}
              {expanded.includes(cat.id) && cat.subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 pl-14 border-b border-border bg-muted/10 hover:bg-muted/20">
                  <span className="text-sm text-foreground flex-1">{sub.name}</span>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-3 h-3 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
