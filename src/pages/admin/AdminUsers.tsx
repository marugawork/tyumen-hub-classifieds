import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { mockUsers, type MockUser } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Ban, Unlock, Trash2, Building2, ShieldCheck, Eye, ChevronDown } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && u.type !== typeFilter) return false;
    return true;
  });

  const toggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } as MockUser : u))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Пользователи ({filtered.length})</h1>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="pl-9" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Все типы</option>
            <option value="private">Частное лицо</option>
            <option value="business">Бизнес</option>
          </select>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Пользователь</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Телефон</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Тип</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Регистрация</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Объявл.</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Статус</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                          {u.name[0]}
                        </div>
                        <span className="font-bold text-foreground truncate max-w-[150px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs">{u.email}</td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">{u.phone}</td>
                    <td className="p-3 hidden md:table-cell">
                      <Badge variant={u.type === "business" ? "default" : "secondary"} className="text-[10px]">
                        {u.type === "business" ? "Бизнес" : "Частное лицо"}
                      </Badge>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">{u.registeredAt}</td>
                    <td className="p-3 text-foreground font-semibold">{u.listingsCount}</td>
                    <td className="p-3">
                      <Badge variant={u.status === "active" ? "secondary" : "destructive"} className="text-[10px]">
                        {u.status === "active" ? "Активен" : "Заблокирован"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button title="Объявления" className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button
                          title={u.status === "active" ? "Блокировать" : "Разблокировать"}
                          onClick={() => toggleBlock(u.id)}
                          className="p-1.5 rounded-md hover:bg-muted"
                        >
                          {u.status === "active" ? <Ban className="w-3.5 h-3.5 text-destructive" /> : <Unlock className="w-3.5 h-3.5 text-success" />}
                        </button>
                        <button title="Сделать бизнесом" className="p-1.5 rounded-md hover:bg-muted"><Building2 className="w-3.5 h-3.5 text-accent" /></button>
                        <button title="Сделать админом" className="p-1.5 rounded-md hover:bg-muted"><ShieldCheck className="w-3.5 h-3.5 text-primary" /></button>
                        <button title="Удалить" className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
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
