import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, HelpCircle, FileText, AlertTriangle } from "lucide-react";

const faqs = [
  { q: "Как разместить объявление?", a: "Нажмите «Разместить» в верхней панели. Заполните категорию, описание, фото и цену. После публикации объявление появится в каталоге." },
  { q: "Как связаться с продавцом?", a: "На странице объявления нажмите «Показать телефон» или «Написать продавцу»." },
  { q: "Как не попасть на мошенников?", a: "Не переводите предоплату, встречайтесь в людных местах, проверяйте товар перед оплатой." },
  { q: "Что такое VIP-объявление?", a: "VIP — платный статус, который выделяет объявление золотой рамкой, поднимает в поиске и закрепляет вверху категории." },
  { q: "Как пожаловаться на объявление?", a: "На странице объявления нажмите «Пожаловаться» и выберите причину." },
  { q: "Как стать бизнес-аккаунтом?", a: "Перейдите в раздел Тарифы и подключите Бизнес-аккаунт. Вы получите логотип, бейдж проверки и расширенную статистику." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6 max-w-3xl">
        <h1 className="text-2xl font-extrabold text-foreground mb-8">Помощь и безопасность</h1>

        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground mb-2">Безопасность сделок</h2>
              <ul className="space-y-2 text-sm text-foreground/80">
                {["Не переводите предоплату незнакомым", "Встречайтесь в людных местах", "Проверяйте товар перед оплатой", "Пользуйтесь встроенным чатом"].map(tip => (
                  <li key={tip} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-extrabold text-foreground">Правила публикации</h2>
          </div>
          <ul className="space-y-2 text-sm text-foreground/80 list-disc list-inside">
            <li>Размещайте объявления только в соответствующей категории</li>
            <li>Не дублируйте одно и то же объявление</li>
            <li>Указывайте актуальную цену</li>
            <li>Запрещены объявления о запрещённых товарах</li>
            <li>Используйте реальные фотографии</li>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-extrabold text-foreground">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-card rounded-xl border border-border group">
                <summary className="p-4 cursor-pointer font-semibold text-foreground text-sm hover:text-accent transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
