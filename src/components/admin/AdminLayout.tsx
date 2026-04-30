import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { adminNotifications } from "@/data/adminMockData";
import {
  LayoutDashboard, FileText, ShieldCheck, Users, Building2, Megaphone,
  Code, TrendingUp, DollarSign, Grid3X3, MapPin, Settings, ScrollText,
  LogOut, Bell, ChevronLeft, ChevronRight, Menu, Zap, BarChart3, Sparkles,
  Upload, Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/growth", icon: Zap, label: "Growth Engine", accent: true },
  { path: "/admin/growth/analytics", icon: BarChart3, label: "Growth Analytics" },
  { path: "/admin/growth/recommendations", icon: Sparkles, label: "AI-рекомендации" },
  { path: "/admin/growth/seed", icon: Sparkles, label: "AI Seed Generator" },
  { path: "/admin/growth/import", icon: Upload, label: "CSV Import" },
  { path: "/admin/growth/empty-categories", icon: Search, label: "Пустые категории" },
  { path: "/admin/listings", icon: FileText, label: "Объявления" },
  { path: "/admin/moderation", icon: ShieldCheck, label: "Модерация", badge: 8 },
  { path: "/admin/users", icon: Users, label: "Пользователи" },
  { path: "/admin/business", icon: Building2, label: "Бизнес-аккаунты" },
  { path: "/admin/ads", icon: Megaphone, label: "Реклама и баннеры" },
  { path: "/admin/direct-ads", icon: Code, label: "Direct / код рекламы" },
  { path: "/admin/promotion", icon: TrendingUp, label: "Продвижение" },
  { path: "/admin/finances", icon: DollarSign, label: "Финансы" },
  { path: "/admin/categories", icon: Grid3X3, label: "Категории" },
  { path: "/admin/districts", icon: MapPin, label: "Районы" },
  { path: "/admin/tariffs", icon: Settings, label: "Настройки тарифов" },
  { path: "/admin/logs", icon: ScrollText, label: "Логи" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, logout } = useAdminAuth();
  const unreadCount = adminNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    if (path === "/admin/growth") return location.pathname === "/admin/growth";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col border-r border-border bg-card transition-all duration-200 ${
          collapsed ? "w-16" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-premium flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-extrabold text-sm text-foreground truncate">НЮ.Инфо Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">{item.badge}</Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 space-y-1 shrink-0">
          {!collapsed && (
            <div className="px-3 py-1.5 text-xs text-muted-foreground truncate">{email}</div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Выйти</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Свернуть</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← На сайт
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
