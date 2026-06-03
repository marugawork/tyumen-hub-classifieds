import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Upload, Check, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { categories } from "@/data/categories";
import { districts } from "@/data/districts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    categoryId: "", subcategoryId: "", title: "", description: "", price: "",
    condition: "used" as "new" | "used", photos: [] as string[], district: "",
    contactName: "", contactPhone: "",
    flags: { urgent: false, bargain: false, delivery: false },
  });

  const selectedCat = categories.find(c => c.id === form.categoryId);
  const updateForm = (partial: Partial<typeof form>) => setForm(prev => ({ ...prev, ...partial }));

  const canProceed = () => {
    if (step === 1) return !!form.categoryId;
    if (step === 2) return form.title.length >= 5 && form.description.length >= 10;
    return form.contactName && form.contactPhone && form.district;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6 max-w-2xl">
        <BreadcrumbNav crumbs={[{ label: "Разместить объявление" }]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Новое объявление</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s < step ? "bg-success text-success-foreground" : s === step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm hidden sm:inline ${s === step ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {s === 1 ? "Категория" : s === 2 ? "Описание" : "Контакты"}
              </span>
              {s < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground">Выберите категорию</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => updateForm({ categoryId: cat.id, subcategoryId: "" })}
                    className={`category-tile bg-card border border-border rounded-xl p-4 ${form.categoryId === cat.id ? "ring-2 ring-accent border-accent" : ""}`}>
                    <Icon className="w-6 h-6 mb-2" style={{ color: `hsl(var(--cat-${cat.colorVar.replace("cat-", "")}))` }} />
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            {selectedCat && selectedCat.subcategories.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Подкатегория</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCat.subcategories.map(sub => (
                    <button key={sub.id} onClick={() => updateForm({ subcategoryId: sub.id })}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                        form.subcategoryId === sub.id ? "bg-accent text-accent-foreground border-accent" : "bg-card text-foreground border-border hover:border-accent/50"
                      }`}>{sub.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="text-sm font-bold text-foreground">Заголовок *</label>
              <input type="text" maxLength={100} value={form.title} onChange={e => updateForm({ title: e.target.value })}
                placeholder="Например: iPhone 14 Pro, 256 ГБ"
                className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent" />
              <p className="text-xs text-muted-foreground mt-1">{form.title.length}/100</p>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">Описание *</label>
              <textarea rows={5} maxLength={3000} value={form.description} onChange={e => updateForm({ description: e.target.value })}
                placeholder="Подробно опишите товар..."
                className="mt-1 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-foreground">Цена, ₽</label>
                <input type="number" value={form.price} onChange={e => updateForm({ price: e.target.value })}
                  className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20" />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground">Состояние</label>
                <div className="flex gap-2 mt-1">
                  {(["new", "used"] as const).map(c => (
                    <button key={c} onClick={() => updateForm({ condition: c })}
                      className={`flex-1 h-11 rounded-xl border text-sm font-bold transition-colors ${
                        form.condition === c ? "bg-accent text-accent-foreground border-accent" : "bg-background text-foreground border-input"
                      }`}>{c === "new" ? "Новое" : "Б/у"}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">Фотографии</label>
              <div className="mt-1 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Перетащите фото или нажмите</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[{ key: "urgent" as const, label: "Срочно" }, { key: "bargain" as const, label: "Торг" }, { key: "delivery" as const, label: "Доставка" }].map(f => (
                <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.flags[f.key]} onChange={e => updateForm({ flags: { ...form.flags, [f.key]: e.target.checked } })} className="rounded border-input" />
                  <span className="text-sm text-foreground">{f.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="text-sm font-bold text-foreground">Ваше имя *</label>
              <input type="text" value={form.contactName} onChange={e => updateForm({ contactName: e.target.value })}
                className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">Телефон *</label>
              <input type="tel" value={form.contactPhone} onChange={e => updateForm({ contactPhone: e.target.value })} placeholder="+7 (___) ___-__-__"
                className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">Район *</label>
              <select value={form.district} onChange={e => updateForm({ district: e.target.value })}
                className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground">
                <option value="">Выберите район</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-bold text-foreground mb-2">Предпросмотр</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Категория:</span> {selectedCat?.name}</p>
                <p><span className="text-muted-foreground">Заголовок:</span> {form.title}</p>
                <p><span className="text-muted-foreground">Цена:</span> {form.price ? `${Number(form.price).toLocaleString("ru-RU")} ₽` : "Бесплатно"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="rounded-xl">Назад</Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="bg-accent text-accent-foreground rounded-xl">Далее</Button>
          ) : (
            <Button onClick={() => navigate("/profile?created=true")} disabled={!canProceed()} className="bg-accent text-accent-foreground rounded-xl">Опубликовать</Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
