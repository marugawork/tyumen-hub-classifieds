import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Shield, FileText, Users, BarChart3, Settings, Eye, Ban, Check, X, AlertTriangle, Crown } from "lucide-react";
import { listings } from "@/data/listings";

export default function AdminPage() {
  const [tab, setTab] = useState<"moderation" | "users" | "tariffs" | "categories" | "stats">("moderation");
  
  const pendingListings = listings.slice(0, 6);
  const reports = [
    { id: "r1", listing: "iPhone 15 Pro", reason: "Мошенничество", reporter: "Иван", date: "25.02.2026" },
    { id: "r2", listing: "Квартира 2-к", reason: "Неактуальное", reporter: "Мария", date: "24.02.2026" },
    { id: "r3", listing: "ВАЗ 2114", reason: "Неверная категория", reporter: "Алексей", date: "24.02.2026" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Админ-панель</h1>
            <p className="text-sm text-muted-foreground">Управление площадкой</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 shrink-0">
            <nav className="space-y-1">
              {[
                { id: "moderation" as const, icon: FileText, label: "Модерация" },
                { id: "users" as const, icon: Users, label: "Пользователи" },
                { id: "tariffs" as const, icon: Crown, label: "Тарифы" },
                { id: "categories" as const, icon: Settings, label: "Категории" },
                { id: "stats" as const, icon: BarChart3, label: "Статистика" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    tab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {tab === "moderation" && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-foreground mb-3">На модерации ({pendingListings.length})</h2>
                  <div className="space-y-2">
                    {pendingListings.map(l => (
                      <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                        <img src={l.photos[0]} alt="" className="w-16 h-14 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-foreground truncate">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{l.authorName} • {l.district}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20"><Check className="w-4 h-4" /></button>
                          <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><X className="w-4 h-4" /></button>
                          <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"><Eye className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-foreground mb-3">Жалобы ({reports.length})</h2>
                  <div className="space-y-2">
                    {reports.map(r => (
                      <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-foreground">{r.listing}</p>
                          <p className="text-xs text-muted-foreground">{r.reason} • от {r.reporter} • {r.date}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold">Удалить</button>
                          <button className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Отклонить</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "users" && (
              <div className="animate-fade-in space-y-3">
                <h2 className="text-lg font-extrabold text-foreground mb-3">Пользователи</h2>
                {["Алексей", "Мария", "ЮганскАвто", "Дмитрий", "ТехноСервис", "Елена", "НефтеСтрой"].map((name, i) => (
                  <div key={name} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">{name[0]}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{i < 2 || i === 3 || i === 5 ? "Частное лицо" : "Бизнес"} • {Math.floor(Math.random() * 20) + 1} объявлений</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Блок
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "tariffs" && (
              <div className="animate-fade-in space-y-3">
                <h2 className="text-lg font-extrabold text-foreground mb-3">Управление тарифами</h2>
                {[
                  { name: "Поднятие", price: "99 ₽", active: true },
                  { name: "VIP", price: "299 ₽", active: true },
                  { name: "Закрепление", price: "199 ₽", active: true },
                  { name: "Выделение", price: "49 ₽", active: true },
                  { name: "Бизнес-аккаунт", price: "990 ₽/мес", active: true },
                ].map(t => (
                  <div key={t.name} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-foreground">{t.name}</p>
                      <p className="text-sm text-accent font-extrabold">{t.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success font-semibold">Активен</span>
                      <button className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Изменить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "categories" && (
              <div className="animate-fade-in space-y-3">
                <h2 className="text-lg font-extrabold text-foreground mb-3">Управление категориями</h2>
                {["Транспорт", "Недвижимость", "Работа", "Услуги", "Личные вещи", "Электроника", "Для дома", "Хобби", "Животные", "Для бизнеса"].map(c => (
                  <div key={c} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                    <p className="font-bold text-sm text-foreground">{c}</p>
                    <button className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Редактировать</button>
                  </div>
                ))}
              </div>
            )}

            {tab === "stats" && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-lg font-extrabold text-foreground mb-3">Статистика площадки</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Объявления", value: listings.length },
                    { label: "Пользователи", value: "1 284" },
                    { label: "VIP активных", value: listings.filter(l => l.vip).length },
                    { label: "Доход (мес)", value: "87 450 ₽" },
                  ].map(s => (
                    <div key={s.label} className="bg-card rounded-xl border border-border p-4">
                      <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
