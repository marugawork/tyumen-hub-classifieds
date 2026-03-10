import AdminLayout from "@/components/admin/AdminLayout";
import { promotionListings } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Zap, ArrowUp, MapPin, Calendar, X } from "lucide-react";

const promoTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  vip: { label: "VIP", icon: Crown, color: "bg-[hsl(var(--vip))]/10 text-[hsl(var(--vip))]" },
  top: { label: "TOP", icon: TrendingUp, color: "bg-primary/10 text-primary" },
  urgent: { label: "Срочно", icon: Zap, color: "bg-destructive/10 text-destructive" },
  raise: { label: "Поднятие", icon: ArrowUp, color: "bg-success/10 text-success" },
};

export default function AdminPromotion() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Продвижение ({promotionListings.length})</h1>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Объявление</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Тип</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Владелец</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Район</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Срок</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Действия</th>
                </tr>
              </thead>
              <tbody>
                {promotionListings.map((l) => {
                  const pType = l.promotion_type || (l.vip ? "vip" : null);
                  const cfg = pType ? promoTypeConfig[pType] : null;
                  return (
                    <tr key={l.id} className="border-b border-border hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={l.photos[0]} alt="" className="w-10 h-8 rounded-md object-cover" />
                          <span className="font-bold text-foreground truncate max-w-[180px]">{l.title}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {cfg && (
                          <Badge className={`text-[10px] border-0 gap-1 ${cfg.color}`}>
                            <cfg.icon className="w-3 h-3" />
                            {cfg.label}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{l.authorName}</td>
                      <td className="p-3 hidden md:table-cell">
                        {l.promotion_district ? (
                          <Badge variant="secondary" className="text-[10px] gap-1"><MapPin className="w-3 h-3" />{l.promotion_district}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {l.promotion_start && l.promotion_end ? (
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{l.promotion_start.slice(0, 10)} — {l.promotion_end.slice(0, 10)}</span>
                        ) : "—"}
                      </td>
                      <td className="p-3 text-right">
                        <button className="p-1.5 rounded-md hover:bg-destructive/10" title="Снять продвижение">
                          <X className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
