import AdminLayout from "@/components/admin/AdminLayout";
import { growthDailySnapshots, growthSummary, aiRecommendations } from "@/data/growthMockData";
import { TrendingUp, Users, FileText, DollarSign, Zap, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

function MetricCard({ label, value, delta, icon: Icon, suffix }: { label: string; value: string | number; delta: number; icon: any; suffix?: string }) {
  const positive = delta >= 0;
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-foreground">{value}{suffix}</p>
      <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {positive ? "+" : ""}{delta.toFixed(1)}% за месяц
      </div>
    </div>
  );
}

export default function AdminGrowthDashboard() {
  const last = growthDailySnapshots[growthDailySnapshots.length - 1];
  const topRecs = aiRecommendations.filter((r) => r.priority === "high" || r.priority === "critical").slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h1 className="text-2xl font-extrabold text-foreground">Growth Engine</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Автоматический рост платформы — метрики и AI-рекомендации</p>
          </div>
          <Link to="/admin/growth/recommendations" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
            <Sparkles className="w-4 h-4" /> AI-советы
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Пользователей" value={last.totalUsers.toLocaleString("ru")} delta={growthSummary.usersMoM} icon={Users} />
          <MetricCard label="Объявлений" value={last.totalListings.toLocaleString("ru")} delta={growthSummary.listingsMoM} icon={FileText} />
          <MetricCard label="Доход (день)" value={`${last.revenue.toLocaleString("ru")} ₽`} delta={growthSummary.revenueMoM} icon={DollarSign} />
          <MetricCard label="Виральный коэф." value={growthSummary.viralCoefficient} delta={18.5} icon={TrendingUp} />
        </div>

        {/* Engagement row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Активация (signup → 1-е объявление)</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{growthSummary.activationRate}%</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Retention 7 дней</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{growthSummary.retention7d}%</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Retention 30 дней</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{growthSummary.retention30d}%</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Активных сегодня</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{last.activeUsers.toLocaleString("ru")}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Рост пользователей (30 дней)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={growthDailySnapshots}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="totalUsers" stroke="hsl(212,80%,50%)" fill="hsl(212,80%,50%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Новые объявления по дням</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={growthDailySnapshots}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="newListings" fill="hsl(152,60%,42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-foreground mb-3">Доход (30 дней)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growthDailySnapshots}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(25,90%,52%)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top AI recommendations */}
        {topRecs.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Главные AI-рекомендации
              </h3>
              <Link to="/admin/growth/recommendations" className="text-xs text-accent font-semibold hover:underline">Все →</Link>
            </div>
            <div className="space-y-2">
              {topRecs.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                  <Badge variant={r.priority === "critical" ? "destructive" : "default"} className="shrink-0 mt-0.5">{r.priority}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.description}</p>
                    <p className="text-xs text-success font-semibold mt-1">📈 {r.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
