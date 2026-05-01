import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Loader2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface TrendItem {
  category: string;
  name: string;
  trend: "rising" | "stable" | "declining";
  priority_score: number;
  recommended_actions: string[];
  reason: string;
}

const trendIcons = {
  rising: { Icon: ArrowUp, color: "text-success", bg: "bg-success/10" },
  stable: { Icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
  declining: { Icon: ArrowDown, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function AdminGrowthTrends() {
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [created, setCreated] = useState(0);

  const run = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("trend-analyzer", { body: {} });
      if (error) throw error;
      if (data?.trends) {
        setTrends(data.trends);
        setSummary(data.summary || "");
        setCreated(data.created_recommendations || 0);
        toast({ title: "Анализ готов", description: `Создано рекомендаций: ${data.created_recommendations || 0}` });
      }
    } catch (e) {
      toast({ title: "Ошибка", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...trends].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h1 className="text-2xl font-extrabold text-foreground">AI Trend Analyzer</h1>
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            Запустить анализ
          </button>
        </div>
        <p className="text-sm text-muted-foreground -mt-3">
          AI анализирует покрытие категорий и тренды региона, выдаёт приоритеты развития и автоматически создаёт рекомендации.
        </p>

        {summary && (
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-1">Резюме AI</div>
            <p className="text-sm text-foreground">{summary}</p>
            {created > 0 && (
              <p className="text-xs text-success mt-2">+ {created} рекомендаций добавлено в очередь</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          {sorted.map((t) => {
            const cfg = trendIcons[t.trend];
            return (
              <div key={t.category} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <cfg.Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-foreground">{t.name}</h3>
                    <Badge variant={t.priority_score >= 85 ? "destructive" : t.priority_score >= 70 ? "default" : "secondary"}>
                      приоритет {t.priority_score}
                    </Badge>
                    <Badge variant="outline">{t.trend}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{t.reason}</p>
                  <ul className="text-xs text-foreground space-y-0.5">
                    {t.recommended_actions.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          {trends.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Нажмите «Запустить анализ» для генерации трендов.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
