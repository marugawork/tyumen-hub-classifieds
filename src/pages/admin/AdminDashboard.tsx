import AdminLayout from "@/components/admin/AdminLayout";
import { getKpiData, listingsPerDay, usersPerDay, revenuePerDay, categoryStats, districtStats, adminNotifications } from "@/data/adminMockData";
import {
  FileText, Users, ShieldCheck, Crown, TrendingUp, Trash2,
  UserPlus, Building2, AlertTriangle, Megaphone, Image, DollarSign,
  Bell,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const COLORS = [
  "hsl(212, 80%, 50%)", "hsl(152, 60%, 42%)", "hsl(25, 90%, 52%)",
  "hsl(265, 60%, 55%)", "hsl(340, 65%, 55%)", "hsl(175, 55%, 42%)",
  "hsl(230, 70%, 55%)", "hsl(42, 85%, 50%)", "hsl(145, 55%, 45%)",
  "hsl(220, 20%, 40%)",
];

export default function AdminDashboard() {
  const kpi = getKpiData();
  const unread = adminNotifications.filter((n) => !n.read);

  const kpiCards = [
    { label: "Всего объявлений", value: kpi.totalListings, icon: FileText, color: "text-primary" },
    { label: "Активных", value: kpi.activeListings, icon: FileText, color: "text-success" },
    { label: "На модерации", value: kpi.onModeration, icon: ShieldCheck, color: "text-accent" },
    { label: "VIP", value: kpi.vipListings, icon: Crown, color: "text-[hsl(var(--vip))]" },
    { label: "TOP", value: kpi.topListings, icon: TrendingUp, color: "text-primary" },
    { label: "Удалённых", value: kpi.deletedListings, icon: Trash2, color: "text-destructive" },
    { label: "Пользователей", value: kpi.totalUsers, icon: Users, color: "text-primary" },
    { label: "Новых сегодня", value: kpi.newUsersToday, icon: UserPlus, color: "text-success" },
    { label: "Бизнес-аккаунтов", value: kpi.businessAccounts, icon: Building2, color: "text-accent" },
    { label: "Жалоб сегодня", value: kpi.complaintsToday, icon: AlertTriangle, color: "text-destructive" },
    { label: "Рекл. кампаний", value: kpi.activeCampaigns, icon: Megaphone, color: "text-primary" },
    { label: "Баннеров", value: kpi.activeBanners, icon: Image, color: "text-accent" },
  ];

  const revenueCards = [
    { label: "Доход за день", value: `${kpi.revenueDay.toLocaleString("ru")} ₽` },
    { label: "Доход за неделю", value: `${kpi.revenueWeek.toLocaleString("ru")} ₽` },
    { label: "Доход за месяц", value: `${kpi.revenueMonth.toLocaleString("ru")} ₽` },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {kpiCards.map((k) => (
            <div key={k.label} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className={`w-4 h-4 ${k.color}`} />
                <span className="text-xs text-muted-foreground truncate">{k.label}</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Revenue cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {revenueCards.map((r) => (
            <div key={r.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p className="text-lg font-extrabold text-foreground">{r.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Listings per day */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Объявления по дням</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={listingsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="hsl(212,80%,50%)" fill="hsl(212,80%,50%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Users per day */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Новые пользователи по дням</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={usersPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(152,60%,42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Доходы по дням</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenuePerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="banners" stackId="a" fill="hsl(212,80%,50%)" name="Баннеры" />
                <Bar dataKey="vip" stackId="a" fill="hsl(45,93%,47%)" name="VIP" />
                <Bar dataKey="top" stackId="a" fill="hsl(152,60%,42%)" name="TOP" />
                <Bar dataKey="raise" stackId="a" fill="hsl(25,90%,52%)" name="Поднятие" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Categories pie */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Популярные категории</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryStats} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications */}
        {unread.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-destructive" />
              Непрочитанные уведомления ({unread.length})
            </h3>
            <div className="space-y-2">
              {unread.map((n) => (
                <div key={n.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                  <p className="text-sm text-foreground flex-1">{n.message}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* District stats */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Объявления по районам</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={districtStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(25,90%,52%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
