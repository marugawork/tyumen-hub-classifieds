import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ModerationResult {
  moderation_score: number;
  fraud_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  status: "approved" | "review_required" | "blocked";
  violations: string[];
  explanation: string;
}

const riskColor: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-destructive-foreground border-destructive",
};

const statusLabel: Record<string, string> = {
  approved: "Одобрено",
  review_required: "На проверку",
  blocked: "Заблокировано",
};

export default function AdminAIModeration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });

  const run = async () => {
    if (!form.title || !form.description) {
      toast({ title: "Заполните заголовок и описание", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-moderation", {
        body: {
          title: form.title,
          description: form.description,
          price: form.price ? Number(form.price) : undefined,
          category: form.category || undefined,
        },
      });
      if (error) throw error;
      setResult(data);
    } catch (e) {
      toast({ title: "Ошибка модерации", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">AI Moderation Center</h1>
            <p className="text-sm text-muted-foreground">Тестовая модерация объявления через AI</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <input className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm"
            placeholder="Заголовок объявления"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm resize-none"
            placeholder="Описание"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="h-11 px-4 rounded-lg border border-input bg-background text-sm"
              placeholder="Цена, ₽" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className="h-11 px-4 rounded-lg border border-input bg-background text-sm"
              placeholder="Категория" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <button onClick={run} disabled={loading}
            className="h-11 px-6 rounded-lg bg-accent text-accent-foreground text-sm font-bold disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Проверить
          </button>
        </div>

        {result && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={riskColor[result.risk_level]}>Риск: {result.risk_level}</Badge>
              <Badge variant="outline">Статус: {statusLabel[result.status]}</Badge>
              <Badge variant="outline">Модерация: {result.moderation_score}</Badge>
              <Badge variant="outline">Фрод: {result.fraud_score}</Badge>
            </div>
            {result.violations.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <ul className="text-sm text-foreground space-y-1">
                  {result.violations.map((v, i) => <li key={i}>• {v}</li>)}
                </ul>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
