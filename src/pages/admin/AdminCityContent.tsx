import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Calendar, Check, X, MapPin } from "lucide-react";

interface CityPost {
  id: string;
  type: string;
  title: string;
  body: string;
  event_date: string | null;
  district: string | null;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "На модерации",
  published: "Опубликовано",
  rejected: "Отклонено",
};

export default function AdminCityContent() {
  const [posts, setPosts] = useState<CityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "published" | "all">("pending");

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("city_posts")
      .select("id, type, title, body, event_date, district, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setPosts((data ?? []) as CityPost[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id: string, status: "published" | "rejected") => {
    await supabase.from("city_posts").update({ status }).eq("id", id);
    setPosts(prev => prev.filter(p => (filter === "all" ? true : p.id !== id)));
    if (filter === "all") load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold text-foreground">Городской контент</h1>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["pending", "published", "all"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {f === "pending" ? "На модерации" : f === "published" ? "Опубликованные" : "Все"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-bold text-foreground mb-1">Пока пусто</p>
            <p className="text-sm text-muted-foreground">
              Здесь появятся новости и события, отправленные авторами на модерацию.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map(p => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    {p.type === "event" ? (
                      <Calendar className="w-5 h-5 text-accent" />
                    ) : (
                      <Newspaper className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm text-foreground">{p.title}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.type === "event" ? "Событие" : "Новость"}
                      {p.event_date && ` • ${new Date(p.event_date).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
                      {` • ${new Date(p.created_at).toLocaleDateString("ru-RU")}`}
                    </p>
                    {p.district && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{p.district}
                      </p>
                    )}
                    {p.body && <p className="text-sm text-foreground mt-2 whitespace-pre-line line-clamp-4">{p.body}</p>}
                  </div>
                  {p.status === "pending" && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        title="Опубликовать"
                        onClick={() => setStatus(p.id, "published")}
                        className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        title="Отклонить"
                        onClick={() => setStatus(p.id, "rejected")}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
