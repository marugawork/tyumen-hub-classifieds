import AdminLayout from "@/components/admin/AdminLayout";
import { growthDailySnapshots, growthSummary, categoryGrowthData } from "@/data/growthMockData";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

export default function AdminGrowthAnalytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-extrabold text-foreground">Growth Analytics</h1>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Рост пользователей WoW", value: `+${growthSummary.usersWoW}%` },
            { label: "Рост пользователей MoM", value: `+${growthSummary.usersMoM}%` },
            { label: "Рост объявлений WoW", value: `+${growthSummary.listingsWoW}%` },
            { label: "Рост объявлений MoM", value: `+${growthSummary.listingsMoM}%` },
            { label: "Рост дохода WoW", value: `+${growthSummary.revenueWoW}%` },
            { label: "Рост дохода MoM", value: `+${growthSummary.revenueMoM}%` },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-extrabold text-success mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Combined chart */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Пользователи vs Объявления (30 дней)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthDailySnapshots}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalUsers" name="Пользователи" stroke="hsl(212,80%,50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="totalListings" name="Объявления" stroke="hsl(152,60%,42%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category gap analysis */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-1">Анализ роста по категориям</h3>
          <p className="text-xs text-muted-foreground mb-3">Текущее vs потенциал. Большой gap = возможность для роста.</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" name="Сейчас" fill="hsl(212,80%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="potential" name="Потенциал" fill="hsl(25,90%,52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
