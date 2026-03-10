import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { listings } from "@/data/listings";
import { categories } from "@/data/categories";
import { districts } from "@/data/districts";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2, EyeOff, Crown, TrendingUp, RotateCcw, Pin } from "lucide-react";

type SortKey = "date" | "views" | "title";

export default function AdminListings() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("date");

  const filtered = useMemo(() => {
    let items = [...listings];
    if (search) items = items.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) items = items.filter((l) => l.categoryId === categoryFilter);
    if (districtFilter) items = items.filter((l) => l.district === districtFilter);
    if (statusFilter === "vip") items = items.filter((l) => l.vip);
    if (statusFilter === "promoted") items = items.filter((l) => l.promoted);
    if (sort === "views") items.sort((a, b) => b.views - a.views);
    if (sort === "date") items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [search, categoryFilter, districtFilter, statusFilter, sort]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-extrabold text-foreground">Объявления ({filtered.length})</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Все районы</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Все статусы</option>
            <option value="vip">VIP</option>
            <option value="promoted">Продвигаемые</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="date">По дате</option>
            <option value="views">По просмотрам</option>
            <option value="title">По названию</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Фото</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Название</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Автор</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Район</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden lg:table-cell">Цена</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">Просм.</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Статус</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((l) => (
                  <tr key={l.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <img src={l.photos[0]} alt="" className="w-12 h-10 rounded-lg object-cover" />
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-foreground truncate max-w-[200px]">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{categories.find(c => c.id === l.categoryId)?.name}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{l.authorName}</td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">{l.district}</td>
                    <td className="p-3 hidden lg:table-cell font-bold text-foreground">{l.price > 0 ? `${l.price.toLocaleString("ru")} ₽` : "Бесплатно"}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{l.views}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {l.vip && <Badge className="text-[10px] bg-[hsl(var(--vip))] text-white border-0">VIP</Badge>}
                        {l.promotion_type === "top" && <Badge className="text-[10px]">TOP</Badge>}
                        {l.flags.urgent && <Badge variant="destructive" className="text-[10px]">Срочно</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button title="Просмотр" className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button title="VIP" className="p-1.5 rounded-md hover:bg-muted"><Crown className="w-3.5 h-3.5 text-[hsl(var(--vip))]" /></button>
                        <button title="TOP" className="p-1.5 rounded-md hover:bg-muted"><TrendingUp className="w-3.5 h-3.5 text-primary" /></button>
                        <button title="Закрепить" className="p-1.5 rounded-md hover:bg-muted"><Pin className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button title="Скрыть" className="p-1.5 rounded-md hover:bg-muted"><EyeOff className="w-3.5 h-3.5 text-muted-foreground" /></button>
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
