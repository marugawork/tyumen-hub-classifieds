import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/listings";
import { User, Settings, FileText, Archive, Clock, Crown, BarChart3, Wallet, TrendingUp, Eye, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [tab, setTab] = useState<"listings" | "stats" | "promote" | "balance" | "settings">("listings");
  const [listingTab, setListingTab] = useState<"active" | "archive">("active");

  const myListings = listings.slice(0, 8);
  const totalViews = myListings.reduce((sum, l) => sum + l.views, 0);
  const totalFavs = myListings.reduce((sum, l) => sum + l.favorites, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        {/* Profile header */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-premium flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Пользователь</h1>
              <p className="text-sm text-muted-foreground">user@nefteyugansk.info</p>
              <p className="text-xs text-muted-foreground mt-1">На сайте с января 2025</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link to="/create" className="text-sm text-accent font-bold hover:text-accent/80">+ Новое объявление</Link>
            <span className="text-border">|</span>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Админ-панель
            </Link>
          </div>
        </div>

        {/* Sidebar tabs */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-56 shrink-0">
            <nav className="space-y-1">
              {[
                { id: "listings" as const, icon: FileText, label: "Мои объявления" },
                { id: "stats" as const, icon: BarChart3, label: "Статистика" },
                { id: "promote" as const, icon: Crown, label: "Продвижение" },
                { id: "balance" as const, icon: Wallet, label: "Баланс" },
                { id: "settings" as const, icon: Settings, label: "Настройки" },
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Listings tab */}
            {tab === "listings" && (
              <div className="animate-fade-in">
                <div className="flex gap-1 mb-4">
                  <button onClick={() => setListingTab("active")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${listingTab === "active" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                    <div className="flex items-center gap-1.5"><FileText className="w-4 h-4" />Активные ({myListings.length})</div>
                  </button>
                  <button onClick={() => setListingTab("archive")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${listingTab === "archive" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                    <div className="flex items-center gap-1.5"><Archive className="w-4 h-4" />Архив (0)</div>
                  </button>
                </div>

                {listingTab === "active" && (
                  <div className="space-y-3">
                    {myListings.map(l => (
                      <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                        <img src={l.photos[0]} alt="" className="w-24 h-20 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link to={`/listing/${l.id}`} className="font-bold text-sm text-foreground hover:text-accent transition-colors line-clamp-1">{l.title}</Link>
                          <p className="text-base font-extrabold text-accent mt-0.5">{l.price.toLocaleString("ru-RU")} ₽</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{l.favorites}</span>
                            {l.vip && <span className="badge-vip text-[9px] px-1.5 py-0">VIP</span>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <Link to={`/promote/${l.id}`} className="px-3 py-1.5 rounded-lg bg-vip/10 text-vip text-xs font-bold hover:bg-vip/20 transition-colors flex items-center gap-1">
                            <Crown className="w-3 h-3" /> Продвинуть
                          </Link>
                          <button className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80">
                            Редактировать
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {listingTab === "archive" && (
                  <div className="text-center py-16">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Архив пуст</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats tab */}
            {tab === "stats" && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-lg font-extrabold text-foreground">Статистика</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Просмотры", value: totalViews, icon: Eye, color: "text-accent" },
                    { label: "В избранном", value: totalFavs, icon: Heart, color: "text-destructive" },
                    { label: "Объявления", value: myListings.length, icon: FileText, color: "text-primary" },
                    { label: "Сообщения", value: 12, icon: MessageCircle, color: "text-success" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                      <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Mock chart */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4">Просмотры за 7 дней</h3>
                  <div className="flex items-end gap-2 h-32">
                    {[45, 62, 38, 85, 72, 90, 55].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-accent/20 rounded-t-md relative overflow-hidden" style={{ height: `${v}%` }}>
                          <div className="absolute inset-0 bg-accent rounded-t-md" style={{ height: "100%" }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Promote tab */}
            {tab === "promote" && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-lg font-extrabold text-foreground">Продвижение объявлений</h2>
                <p className="text-sm text-muted-foreground">Выберите объявление для продвижения:</p>
                {myListings.slice(0, 4).map(l => (
                  <div key={l.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <img src={l.photos[0]} alt="" className="w-16 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.views} просмотров</p>
                    </div>
                    <Link to={`/promote/${l.id}`} className="px-4 py-2 rounded-xl bg-vip text-foreground font-bold text-sm hover:bg-vip/90 transition-colors">
                      Продвинуть
                    </Link>
                  </div>
                ))}
                <Link to="/pricing" className="text-sm text-accent font-semibold hover:text-accent/80">Все тарифы →</Link>
              </div>
            )}

            {/* Balance tab */}
            {tab === "balance" && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-lg font-extrabold text-foreground">Баланс</h2>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="text-sm text-muted-foreground mb-1">Текущий баланс</p>
                  <p className="text-3xl font-extrabold text-foreground">0 ₽</p>
                  <button className="mt-4 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90">
                    Пополнить баланс
                  </button>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-3">История платежей</h3>
                  <p className="text-sm text-muted-foreground">Платежей пока нет</p>
                </div>
              </div>
            )}

            {/* Settings tab */}
            {tab === "settings" && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-lg font-extrabold text-foreground">Настройки профиля</h2>
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  {[
                    { label: "Имя", value: "Пользователь" },
                    { label: "Email", value: "user@nefteyugansk.info" },
                    { label: "Телефон", value: "+7 (3463) 22-XX-XX" },
                    { label: "Город", value: "Нефтеюганск" },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="mt-1 w-full h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  ))}
                  <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90">
                    Сохранить
                  </button>
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
