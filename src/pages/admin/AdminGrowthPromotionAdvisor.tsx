import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Recommendation {
  package: "vip" | "top" | "urgent" | "up";
  duration_days: number;
  price_kopecks: number;
  expected_views_uplift_pct: number;
  expected_contacts_uplift_pct: number;
  reason: string;
  confidence: "low" | "medium" | "high";
}

const packageLabels: Record<string, string> = {
  vip: "VIP",
  top: "TOP",
  urgent: "Срочно",
  up: "Поднять",
};

export default function AdminGrowthPromotionAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "transport",
    price: "",
    days_active: "0",
    views: "0",
    contacts: "0",
    description: "",
  });

  const analyze = async () => {
    if (!form.title || !form.category) {
      toast({ title: "Заполните заголовок и категорию", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("promotion-advisor", {
        body: {
          listing: {
            title: form.title,
            category: form.category,
            price: form.price ? parseInt(form.price) : undefined,
            days_active: parseInt(form.days_active) || 0,
            views: parseInt(form.views) || 0,
            contacts: parseInt(form.contacts) || 0,
            description: form.description,
          },
        },
      });
      if (error) throw error;
      if (data?.recommendation) {
        setResult(data.recommendation);
        toast({ title: "Готово", description: "AI-рекомендация получена" });
      }
    } catch (e) {
      toast({ title: "Ошибка", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-extrabold text-foreground">AI Promotion Advisor</h1>
        </div>
        <p className="text-sm text-muted-foreground -mt-3">
          Введите данные объявления — AI подберёт оптимальный пакет продвижения с прогнозом эффекта.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Заголовок</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Toyota Land Cruiser 200, 2018" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Категория (slug)</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="transport" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Цена, ₽</label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="3500000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Дней в ленте</label>
              <Input type="number" value={form.days_active} onChange={(e) => setForm({ ...form, days_active: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Просмотры</label>
              <Input type="number" value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Обращения</label>
              <Input type="number" value={form.contacts} onChange={(e) => setForm({ ...form, contacts: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Описание (необязательно)</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <button
            onClick={analyze}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Получить рекомендацию
          </button>
        </div>

        {result && (
          <div className="bg-card rounded-xl border-2 border-accent/40 p-5 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
                {packageLabels[result.package]}
              </Badge>
              <span className="text-sm text-muted-foreground">на {result.duration_days} дн.</span>
              <span className="text-sm font-bold text-foreground">
                {(result.price_kopecks / 100).toLocaleString("ru")} ₽
              </span>
              <Badge variant={result.confidence === "high" ? "default" : "secondary"}>
                уверенность: {result.confidence}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-success/10 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Просмотры +</div>
                <div className="text-2xl font-extrabold text-success">{result.expected_views_uplift_pct}%</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Обращения +</div>
                <div className="text-2xl font-extrabold text-primary">{result.expected_contacts_uplift_pct}%</div>
              </div>
            </div>
            <p className="text-sm text-foreground pt-2 border-t border-border">{result.reason}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
