import { Link } from "react-router-dom";
import { Heart, MessageCircle, User, Plus, Menu, X, Crown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { listings } from "@/data/listings";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count: favCount } = useFavorites();

  const totalListings = listings.length;
  const todayListings = listings.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base tracking-tight">НЮ</span>
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-extrabold text-lg text-foreground tracking-tight">
                Нефтеюганск
              </span>
              <span className="font-extrabold text-lg text-accent">.инфо</span>
            </div>
          </Link>

          {/* Stats in header */}
          <div className="hidden md:flex items-center gap-6 text-center">
            <div>
              <span className="text-sm font-bold text-foreground">{totalListings}</span>
              <p className="text-[10px] text-muted-foreground leading-tight">объявлений</p>
            </div>
            <div>
              <span className="text-sm font-bold text-accent">356</span>
              <p className="text-[10px] text-muted-foreground leading-tight">онлайн</p>
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">{todayListings || 9}</span>
              <p className="text-[10px] text-muted-foreground leading-tight">новых сегодня</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              to="/messages"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:flex"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
            <Link
              to="/profile"
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:flex"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link to="/create">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold gap-1.5 rounded-xl h-10 px-5">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Разместить</span>
              </Button>
            </Link>
            <button
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="pb-4 md:hidden animate-fade-in">
            <div className="flex gap-4">
              <Link to="/messages" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <MessageCircle className="w-4 h-4" /> Сообщения
              </Link>
              <Link to="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <User className="w-4 h-4" /> Профиль
              </Link>
              <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Crown className="w-4 h-4" /> Админ
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
