import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImportResult {
  job_id: string;
  total: number;
  inserted: number;
  failed: number;
  errors: Array<{ row: number; reason: string }>;
}

const SAMPLE_CSV = `title,description,price_min,price_max
"iPhone 13","Отличное состояние, полный комплект",30000,40000
"Samsung TV 55","4K Smart TV, гарантия",25000,35000`;

export default function AdminGrowthImport() {
  const [csv, setCsv] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("neftyugansk");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const onFile = async (file: File) => {
    const text = await file.text();
    setCsv(text);
  };

  const submit = async () => {
    if (!csv.trim()) { toast.error("Загрузите CSV или вставьте данные"); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("csv-import", {
        body: { csv, category: category.trim() || undefined, city: city.trim(), source: "csv" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      toast.success(`Импорт завершён: ${data.inserted}/${data.total}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка импорта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6 text-accent" /> CSV Import
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Массовая загрузка шаблонов объявлений из CSV. Обязательные колонки: <code>title</code>, <code>description</code>. Опционально: <code>price_min</code>, <code>price_max</code>.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Загрузить CSV</CardTitle>
            <CardDescription>Перетащите файл или вставьте содержимое вручную</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="cat">Категория</Label>
                <Input id="cat" placeholder="напр. elektronika" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Город</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="file">Файл CSV</Label>
                <Input id="file" type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="csv">Содержимое CSV</Label>
              <Textarea
                id="csv"
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                rows={10}
                placeholder={SAMPLE_CSV}
                className="font-mono text-xs"
              />
              <Button variant="link" type="button" className="px-0 h-auto" onClick={() => setCsv(SAMPLE_CSV)}>
                Вставить пример
              </Button>
            </div>

            <Button onClick={submit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Импортировать
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" /> Импорт #{result.job_id.slice(0, 8)}
              </CardTitle>
              <CardDescription>
                Всего: {result.total} · Загружено: {result.inserted} · Ошибок: {result.failed}
              </CardDescription>
            </CardHeader>
            {result.errors.length > 0 && (
              <CardContent>
                <div className="text-sm font-medium mb-2">Первые ошибки:</div>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {result.errors.map((e, i) => (
                    <li key={i}>Строка {e.row}: {e.reason}</li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
