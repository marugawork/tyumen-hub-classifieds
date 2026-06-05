import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, X, RefreshCw, Shield } from "lucide-react";

interface QueueRow {
  id: string;
  listing_id: string;
  status: string;
  ai_score: number | null;
  ai_risk: string | null;
  ai_reasons: string[];
  created_at: string;
  listings: { title: string; description: string; price: number; author_name: string } | null;
}

const riskColor: Record<string, string> = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
  critical: "destructive",
};

export default function AdminModerationQueue() {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("moderation_queue")
      .select("id, listing_id, status, ai_score, ai_risk, ai_reasons, created_at, listings(title, description, price, author_name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      toast({ title: "Ошибка загрузки", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as unknown as QueueRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const decide = async (row: QueueRow, decision: "approved" | "rejected") => {
    setBusy(row.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: e1 } = await supabase
        .from("moderation_queue")
        .update({ status: decision, reviewer_id: user?.id ?? null, reviewed_at: new Date().toISOString() })
        .eq("id", row.id);
      if (e1) throw e1;

      const { error: e2 } = await supabase
        .from("listings")
        .update({ status: decision === "approved" ? "active" : "rejected" })
        .eq("id", row.listing_id);
      if (e2) throw e2;

      setRows(prev => prev.filter(r => r.id !== row.id));
      toast({ title: decision === "approved" ? "Одобрено" : "Отклонено" });
    } catch (e) {
      toast({ title: "Ошибка", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Очередь модерации</h1>
              <p className="text-sm text-muted-foreground">Объявления, ожидающие проверки администратором</p>
            </div>
          </div>
          <button onClick={load} className="h-10 px-4 rounded-lg border border-border text-sm font-semibold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Обновить
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
            Очередь пуста — все объявления проверены.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left p-3">Объявление</th>
                  <th className="text-left p-3">Автор</th>
                  <th className="text-left p-3">Цена</th>
                  <th className="text-left p-3">AI</th>
                  <th className="text-left p-3">Причины</th>
                  <th className="text-right p-3">Решение</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="p-3 max-w-[260px]">
                      <p className="font-bold text-foreground truncate">{r.listings?.title ?? "—"}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.listings?.description}</p>
                    </td>
                    <td className="p-3 text-muted-foreground">{r.listings?.author_name ?? "—"}</td>
                    <td className="p-3 font-bold text-foreground">{r.listings?.price ? `${Number(r.listings.price).toLocaleString("ru")} ₽` : "—"}</td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <Badge variant={(riskColor[r.ai_risk ?? "low"] ?? "secondary") as never}>{r.ai_risk ?? "—"}</Badge>
                        {r.ai_score !== null && <div className="text-xs text-muted-foreground">score: {r.ai_score}</div>}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground max-w-[240px]">{r.ai_reasons?.join(", ") || "—"}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button disabled={busy === r.id} onClick={() => decide(r, "approved")}
                          className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 disabled:opacity-50">
                          <Check className="w-4 h-4" />
                        </button>
                        <button disabled={busy === r.id} onClick={() => decide(r, "rejected")}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
