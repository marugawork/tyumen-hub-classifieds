import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Crown, Zap, Pin, Palette, Building2, Check } from "lucide-react";
import { Link } from "react-router-dom";

const tariffs = [
  {
    name: "Поднятие",
    icon: Zap,
    price: "99 ₽",
    desc: "Ваше объявление поднимается в начало списка",
    features: ["Поднятие на 1-е место в категории", "Эффект длится 24 часа", "Можно повторять"],
    color: "bg-accent/10 text-accent",
    btnClass: "bg-accent text-accent-foreground hover:bg-accent/90",
  },
  {
    name: "VIP",
    icon: Crown,
    price: "299 ₽",
    desc: "Золотая рамка и максимальная видимость",
    features: ["Золотая рамка вокруг объявления", "Бейдж VIP", "Закрепление вверху категории", "Отдельный блок на главной", "Действует 7 дней"],
    color: "bg-vip/10 text-vip",
    btnClass: "bg-vip text-foreground hover:bg-vip/90",
    popular: true,
  },
  {
    name: "Закрепление",
    icon: Pin,
    price: "199 ₽",
    desc: "Объявление закрепляется вверху на 7 дней",
    features: ["Закрепление в категории", "Не опускается при новых публикациях", "Действует 7 дней"],
    color: "bg-primary/10 text-primary",
    btnClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    name: "Выделение цветом",
    icon: Palette,
    price: "49 ₽",
    desc: "Цветная подложка привлекает внимание",
    features: ["Цветной фон карточки", "Выделяется в ленте", "Действует 3 дня"],
    color: "bg-cat-personal/10 text-cat-personal",
    btnClass: "bg-cat-personal text-white hover:bg-cat-personal/90",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Тарифы продвижения</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Увеличьте видимость ваших объявлений и продавайте быстрее
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tariffs.map(t => (
            <div key={t.name} className={`bg-card rounded-2xl border p-6 relative ${t.popular ? "border-vip" : "border-border"}`}>
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-vip">Популярный</div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${t.color}`}>
                <t.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-1">{t.name}</h3>
              <p className="text-2xl font-black text-foreground mb-2">{t.price}</p>
              <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
              <ul className="space-y-2 mb-6">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/payment" className={`block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-colors ${t.btnClass}`}>
                Выбрать
              </Link>
            </div>
          ))}
        </div>

        {/* Business account */}
        <div className="mt-10 gradient-premium rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-vip" />
            <div>
              <h3 className="text-xl font-extrabold">Бизнес-аккаунт</h3>
              <p className="text-white/60 text-sm">Для компаний и профессиональных продавцов</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ul className="space-y-2">
              {[
                "Логотип и описание компании",
                "Бейдж «Проверенный продавец»",
                "Страница компании со всеми объявлениями",
                "Расширенная статистика просмотров",
                "Приоритетная поддержка",
              ].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                  <Check className="w-4 h-4 text-vip shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-col justify-center items-start">
              <p className="text-3xl font-black text-vip mb-1">990 ₽ / мес</p>
              <p className="text-sm text-white/60 mb-4">Первый месяц — бесплатно</p>
              <Link to="/payment" className="px-6 py-3 rounded-xl bg-vip text-foreground font-bold text-sm hover:bg-vip/90">
                Подключить
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
