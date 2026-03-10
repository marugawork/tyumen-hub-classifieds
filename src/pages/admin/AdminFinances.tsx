import AdminLayout from "@/components/admin/AdminLayout";
import { getKpiData, revenuePerDay } from "@/data/adminMockData";
import { DollarSign, Image, Crown, TrendingUp, ArrowUp, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminFinances() {
  const kpi = getKpiData();

  const sources = [
    { label: "Баннерная реклама", value: kpi.adRevenue, icon: Image, color: "text-primary" },
    { label: "Direct-реклама", value: 12800, icon: DollarSign, color: "text-accent" },
    { label: "VIP-размещения", value: 23900, icon: Crown, color: "text-[hsl(var(--vip))]" },
    { label: "TOP-размещения", value: 11940, icon: TrendingUp, color: "text-primary" },
    { label: "Поднятие объявлений", value: 8910, icon: ArrowUp, color: "text-success" },
    { label: "Бизнес-аккаунты", value: 17820, icon: Building2, color: "text-accent" },
  ];

  const monthlyData = [
    { month: "Окт", total: 198000 },
    { month: "Ноя", total: 245000 },
    { month: "Дек", total: 312000 },
    { month: "Янв", total: 275000 },
    { month: "Фев", total: 310000 },
    { month: "Мар", total: 348200 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground">Финансы</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Доход за день", value: kpi.revenueDay },
            { label: "Доход за неделю", value: kpi.revenueWeek },
            { label: "Доход за месяц", value: kpi.revenueMonth },
          ].map((r) => (
            <div key={r.label} className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">{r.label}</p>
              <p className="text-2xl font-extrabold text-foreground">{r.value.toLocaleString("ru")} ₽</p>
            </div>
          ))}
        </div>

        {/* By source */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">По источникам (текущий месяц)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sources.map((s) => (
              <div key={s.label} className="bg-card rounded-xl border border-border p-3">
                <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
                <p className="text-lg font-extrabold text-foreground">{s.value.toLocaleString("ru")} ₽</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily revenue chart */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Доходы по дням (по типам)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenuePerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="banners" stackId="a" fill="hsl(212,80%,50%)" name="Баннеры" />
              <Bar dataKey="vip" stackId="a" fill="hsl(45,93%,47%)" name="VIP" />
              <Bar dataKey="top" stackId="a" fill="hsl(152,60%,42%)" name="TOP" />
              <Bar dataKey="raise" stackId="a" fill="hsl(25,90%,52%)" name="Поднятие" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Доход по месяцам</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString("ru")} ₽`} />
              <Bar dataKey="total" fill="hsl(212,80%,50%)" radius={[4, 4, 0, 0]} name="Доход" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
