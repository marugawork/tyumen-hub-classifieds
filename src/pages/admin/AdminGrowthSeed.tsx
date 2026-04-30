import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedListing {
  title: string;
  description: string;
  price_min: number;
  price_max: number;
  attributes?: Record<string, unknown>;
}

export default function AdminGrowthSeed() {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Нефтеюганск");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedListing[]>([]);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const generate = async () => {
    if (!category.trim()) { toast.error("Введите категорию"); return; }
    setLoading(true);
    setResults([]);
    setSavedCount(null);
    try {
      const { data, error } = await supabase.functions.invoke("seed-generator", {
        body: { category: category.trim(), city: city.trim(), count, saveAsTemplates: true },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults(data.listings ?? []);
      setSavedCount(data.saved ?? 0);
      toast.success(`Сгенерировано ${data.generated}, сохранено ${data.saved} шаблонов`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка генерации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" /> AI Seed Generator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Автоматическая генерация стартовых шаблонов объявлений через Lovable AI
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Параметры генерации</CardTitle>
            <CardDescription>Шаблоны сохраняются в seed_templates и используются для наполнения новых городов и категорий</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="cat">Категория</Label>
              <Input id="cat" placeholder="напр. elektronika" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Город</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cnt">Количество (1-15)</Label>
              <Input id="cnt" type="number" min={1} max={15} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <div className="sm:col-span-3">
              <Button onClick={generate} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Сгенерировать
              </Button>
            </div>
          </CardContent>
        </Card>

        {savedCount !== null && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Результат
              </CardTitle>
              <CardDescription>
                Сохранено в шаблоны: <Badge variant="secondary">{savedCount}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="font-semibold text-sm">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.description}</div>
                  <div className="text-xs mt-2 text-foreground">
                    {r.price_min?.toLocaleString("ru-RU")} – {r.price_max?.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              ))}
              {!results.length && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Ничего не сгенерировано
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
