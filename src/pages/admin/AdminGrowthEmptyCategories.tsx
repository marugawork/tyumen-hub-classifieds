import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoryReport {
  category: string;
  name: string;
  template_count: number;
  is_empty: boolean;
}

interface DetectorResult {
  threshold: number;
  total_categories: number;
  empty_count: number;
  report: CategoryReport[];
  created_recommendations: number;
}

export default function AdminGrowthEmptyCategories() {
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectorResult | null>(null);

  const scan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("empty-category-detector", {
        body: { threshold },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast.success(`Найдено пустых: ${data.empty_count}, создано рекомендаций: ${data.created_recommendations}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-accent" /> Empty Category Detector
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Сканирует все категории, определяет пустые (по числу seed-шаблонов) и автоматически создаёт рекомендации для AI Seed Generator
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Запуск сканирования</CardTitle>
            <CardDescription>Категория считается пустой, если шаблонов меньше порога</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="th">Порог (шаблонов)</Label>
              <Input id="th" type="number" min={0} className="w-32" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
            </div>
            <Button onClick={scan} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Сканировать
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Отчёт: {result.empty_count} из {result.total_categories} пустых
              </CardTitle>
              <CardDescription>
                Создано рекомендаций: <Badge variant="secondary">{result.created_recommendations}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.report.map((r) => (
                  <div
                    key={r.category}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      r.is_empty ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r.is_empty ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.category}</div>
                      </div>
                    </div>
                    <Badge variant={r.is_empty ? "destructive" : "secondary"}>
                      {r.template_count} шаб.
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
