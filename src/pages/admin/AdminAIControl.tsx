import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface ModuleStats {
  total: number;
  success: number;
  failed: number;
  avg_duration_ms: number | null;
  last_success_at: string | null;
  last_error: string | null;
  last_error_at: string | null;
}

interface AiModule {
  module: string;
  description: string;
  model: string;
  enabled: boolean;
  daily_limit: number;
  updated_at: string | null;
  stats: ModuleStats | null;
}

interface Overview {
  modules: AiModule[];
  provider: { gateway: string; key_configured: boolean };
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

export default function AdminAIControl() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("ai-control", { method: "GET" });
      if (error) throw error;
      setData(res as Overview);
    } catch (e) {
      toast({ title: "Не удалось загрузить AI Control Center", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (mod: AiModule, enabled: boolean) => {
    setSaving(mod.module);
    try {
      const { error } = await supabase.functions.invoke("ai-control", {
        method: "PATCH",
        body: { module: mod.module, enabled },
      });
      if (error) throw error;
      setData((d) => d && {
        ...d,
        modules: d.modules.map((m) => (m.module === mod.module ? { ...m, enabled } : m)),
      });
      toast({ title: enabled ? `Модуль «${mod.description}» включён` : `Модуль «${mod.description}» отключён` });
    } catch (e) {
      toast({ title: "Не удалось сохранить", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-premium flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">AI Control Center</h1>
              <p className="text-sm text-muted-foreground">Централизованное управление AI-модулями платформы</p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </button>
        </div>

        {data && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Провайдер: {data.provider.gateway}</span>
            <span>·</span>
            {data.provider.key_configured ? (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">ключ настроен</Badge>
            ) : (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">ключ не настроен</Badge>
            )}
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4">
            {data?.modules.map((m) => {
              const s = m.stats;
              const errRate = s && s.total > 0 ? Math.round((s.failed / s.total) * 100) : null;
              return (
                <div key={m.module} className="rounded-xl border border-border bg-card p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-foreground">{m.description}</h2>
                        <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{m.module}</code>
                        <Badge variant="outline" className="text-xs">{m.model}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs">Запросов (30 дн.)</div>
                          <div className="font-semibold text-foreground">{s ? s.total : "—"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Ошибки</div>
                          <div className="font-semibold text-foreground">
                            {s ? `${s.failed} (${errRate}%)` : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Ср. время</div>
                          <div className="font-semibold text-foreground">
                            {s?.avg_duration_ms != null ? `${(s.avg_duration_ms / 1000).toFixed(1)} с` : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Последний успех</div>
                          <div className="font-semibold text-foreground">{fmtDate(s?.last_success_at ?? null)}</div>
                        </div>
                      </div>
                      {s?.last_error && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
                          <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>Последняя ошибка ({fmtDate(s.last_error_at)}): {s.last_error}</span>
                        </div>
                      )}
                      {!s && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Вызовов за последние 30 дней не было</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Switch
                        checked={m.enabled}
                        disabled={saving === m.module}
                        onCheckedChange={(v) => toggle(m, v)}
                        aria-label={`Включить ${m.description}`}
                      />
                      <span className="text-xs text-muted-foreground">{m.enabled ? "включён" : "выключен"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
