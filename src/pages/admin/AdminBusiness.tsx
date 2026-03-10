import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockUsers } from "@/data/adminMockData";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Building2, ShieldCheck, Image } from "lucide-react";

export default function AdminBusiness() {
  const bizUsers = mockUsers.filter((u) => u.type === "business");

  const pendingApproval = [
    { id: "bp1", name: "ЗооМир НЮ", email: "zoomir@nyu.ru", date: "08.03.2026", category: "Животные" },
    { id: "bp2", name: "ФитнесПро", email: "fitpro@mail.ru", date: "09.03.2026", category: "Услуги" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground">Бизнес-аккаунты</h1>

        {/* Pending approval */}
        {pendingApproval.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">На проверке ({pendingApproval.length})</h2>
            <div className="space-y-2">
              {pendingApproval.map((b) => (
                <div key={b.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.email} • {b.category} • {b.date}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20"><Check className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><X className="w-4 h-4" /></button>
                    <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active businesses */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Активные ({bizUsers.length})</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Компания</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Объявл.</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Верификация</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Действия</th>
                </tr>
              </thead>
              <tbody>
                {bizUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{u.name[0]}</div>
                        <span className="font-bold text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs">{u.email}</td>
                    <td className="p-3 font-semibold text-foreground">{u.listingsCount}</td>
                    <td className="p-3 hidden md:table-cell">
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <ShieldCheck className="w-3 h-3" /> Проверен
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button title="Витрина" className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button title="Логотип" className="p-1.5 rounded-md hover:bg-muted"><Image className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
