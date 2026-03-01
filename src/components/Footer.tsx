import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container-main py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl gradient-premium flex items-center justify-center">
                <span className="text-white font-black text-xs">НЮ</span>
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-foreground">Нефтеюганск</span>
                <span className="font-extrabold text-accent">.инфо</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Главная площадка объявлений Нефтеюганска. Покупайте и продавайте быстро и безопасно.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Разделы</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/transport" className="hover:text-foreground transition-colors">Транспорт</Link></li>
              <li><Link to="/category/nedvizhimost" className="hover:text-foreground transition-colors">Недвижимость</Link></li>
              <li><Link to="/category/rabota" className="hover:text-foreground transition-colors">Работа</Link></li>
              <li><Link to="/category/elektronika" className="hover:text-foreground transition-colors">Электроника</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Пользователям</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">Помощь</Link></li>
              <li><Link to="/help" className="hover:text-foreground transition-colors">Правила публикации</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Тарифы</Link></li>
              <li><Link to="/help" className="hover:text-foreground transition-colors">Безопасность</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@nefteyugansk.info</li>
              <li>+7 (3463) 22-00-00</li>
              <li>г. Нефтеюганск, ХМАО</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2025 Нефтеюганск.инфо — Региональный маркетплейс объявлений
        </div>
      </div>
    </footer>
  );
}
