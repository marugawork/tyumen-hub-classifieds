import AdminLayout from "@/components/admin/AdminLayout";
import { districts } from "@/data/districts";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Edit, EyeOff, Trash2, Plus, MapPin } from "lucide-react";

export default function AdminDistricts() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">Районы ({districts.length})</h1>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {districts.map((d, i) => (
            <div key={d} className="flex items-center gap-3 p-3 border-b border-border hover:bg-muted/20 transition-colors">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-sm text-foreground flex-1">{d}</span>
              <Badge variant="secondary" className="text-[10px]">#{i + 1}</Badge>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 rounded-md hover:bg-muted" title="Редактировать"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 rounded-md hover:bg-muted" title="Скрыть"><EyeOff className="w-3.5 h-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 rounded-md hover:bg-destructive/10" title="Удалить"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
