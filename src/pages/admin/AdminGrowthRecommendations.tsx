import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { aiRecommendations, cityLaunchCandidates, type AIRecommendation } from "@/data/growthMockData";
import { Sparkles, Check, X, Building2, Tags, Megaphone, DollarSign, BellRing, MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const typeIcons = {
  city_launch: MapPinned,
  category_growth: Tags,
  ad_placement: Megaphone,
  pricing: DollarSign,
  reactivation: BellRing,
};

const priorityColors: Record<string, "default" | "destructive" | "secondary"> = {
  critical: "destructive",
  high: "destructive",
  medium: "default",
  low: "secondary",
};

export default function AdminGrowthRecommendations() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const visible = aiRecommendations.filter((r) => !dismissed.has(r.id));

  const handleApply = (r: AIRecommendation) => {
    setApplied((s) => new Set(s).add(r.id));
    toast({ title: "Рекомендация принята", description: r.title });
  };

  const handleDismiss = (r: AIRecommendation) => {
    setDismissed((s) => new Set(s).add(r.id));
    toast({ title: "Рекомендация скрыта" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-extrabold text-foreground">AI-рекомендации</h1>
        </div>
        <p className="text-sm text-muted-foreground -mt-3">
          AI анализирует метрики платформы и предлагает приоритетные действия для роста.
        </p>

        {/* Recommendations list */}
        <div className="space-y-3">
          {visible.map((r) => {
            const Icon = typeIcons[r.type];
            const isApplied = applied.has(r.id);
            return (
              <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">{r.title}</h3>
                    <Badge variant={priorityColors[r.priority]}>{r.priority}</Badge>
                    {isApplied && <Badge variant="secondary" className="bg-success/15 text-success">принято</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{r.description}</p>
                  <p className="text-xs text-success font-semibold">📈 Ожидаемый эффект: {r.impact}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleApply(r)}
                    disabled={isApplied}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Принять
                  </button>
                  <button
                    onClick={() => handleDismiss(r)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80"
                  >
                    <X className="w-3.5 h-3.5" /> Скрыть
                  </button>
                </div>
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Нет активных рекомендаций. AI проанализирует метрики и предложит новые в ближайшее время.
            </div>
          )}
        </div>

        {/* City launch candidates */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Кандидаты для запуска новых городов</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left py-2 font-medium">Город</th>
                  <th className="text-right py-2 font-medium">Население</th>
                  <th className="text-right py-2 font-medium">Расстояние</th>
                  <th className="text-right py-2 font-medium">Готовность</th>
                  <th className="text-right py-2 font-medium">Действие</th>
                </tr>
              </thead>
              <tbody>
                {cityLaunchCandidates.map((c) => (
                  <tr key={c.city} className="border-b border-border/50">
                    <td className="py-3 font-semibold text-foreground">{c.city}</td>
                    <td className="py-3 text-right text-muted-foreground">{c.population.toLocaleString("ru")}</td>
                    <td className="py-3 text-right text-muted-foreground">{c.distance} км</td>
                    <td className="py-3 text-right">
                      <span className={`font-bold ${c.readiness >= 85 ? "text-success" : c.readiness >= 70 ? "text-accent" : "text-muted-foreground"}`}>
                        {c.readiness}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90">
                        Запустить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
