import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { listings } from "@/data/listings";

interface Flagged {
  index: number;
  fraud_score: number;
  reasons: string[];
  group: string;
}

const groupLabel: Record<string, string> = {
  duplicate: "Дубль",
  spam: "Спам",
  suspicious_price: "Подозр. цена",
  fake_seller: "Фейк-продавец",
  phishing: "Фишинг",
  other: "Прочее",
};

export default function AdminAntiFraud() {
  const [loading, setLoading] = useState(false);
  const [flagged, setFlagged] = useState<Flagged[]>([]);
  const [summary, setSummary] = useState("");

  const sample = listings.slice(0, 30);

  const run = async () => {
    setLoading(true);
    setFlagged([]);
    setSummary("");
    try {
      const { data, error } = await supabase.functions.invoke("anti-fraud", {
        body: {
          items: sample.map(l => ({
            title: l.title,
            description: l.description,
            price: l.price,
            phone: l.authorName,
          })),
        },
      });
      if (error) throw error;
      setFlagged(data?.flagged ?? []);
      setSummary(data?.summary ?? "");
    } catch (e) {
      toast({ title: "Ошибка анализа", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Anti-Fraud Center</h1>
            <p className="text-sm text-muted-foreground">AI-анализ объявлений на дубли, спам и подозрительные паттерны</p>
          </div>
        </div>

        <button onClick={run} disabled={loading}
          className="h-11 px-6 rounded-lg bg-accent text-accent-foreground text-sm font-bold disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
          Сканировать {sample.length} объявлений
        </button>

        {summary && (
          <div className="bg-card border border-border rounded-xl p-4 text-sm text-foreground">{summary}</div>
        )}

        {flagged.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Объявление</th>
                  <th className="text-left p-3">Группа</th>
                  <th className="text-left p-3">Fraud</th>
                  <th className="text-left p-3">Причины</th>
                </tr>
              </thead>
              <tbody>
                {flagged.map((f, i) => {
                  const item = sample[f.index];
                  return (
                    <tr key={i} className="border-t border-border">
                      <td className="p-3 text-foreground">{item?.title ?? `#${f.index}`}</td>
                      <td className="p-3"><Badge variant="outline">{groupLabel[f.group] ?? f.group}</Badge></td>
                      <td className="p-3 font-bold text-destructive">{f.fraud_score}</td>
                      <td className="p-3 text-muted-foreground">{f.reasons.join(", ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
