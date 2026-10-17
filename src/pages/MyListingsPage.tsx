import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, TrendingUp, Zap, Eye, Phone, ArrowUp, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { resolvePhotoUrls, isStoragePath } from "@/lib/listingPhotos";

interface MyListingRow {
  id: string;
  title: string;
  price: number;
  photos: string[];
  district: string | null;
  views: number;
  status: string;
  vip: boolean;
  promotion_type: string | null;
  promotion_expires_at: string | null;
  urgent: boolean;
  created_at: string;
}

function formatPrice(price: number): string {
  if (price === 0) return "Бесплатно";
  return Number(price).toLocaleString("ru-RU") + " ₽";
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">Активно</span>;
    case "pending":
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">На модерации</span>;
    case "rejected":
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Отклонено</span>;
    default:
      return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{status}</span>;
  }
}

function promotionBadge(l: MyListingRow) {
  const endDate = l.promotion_expires_at
    ? new Date(l.promotion_expires_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
    : "";

  if (l.vip || l.promotion_type === "vip") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-vip/10 text-vip text-xs font-bold">
        <Crown className="w-3 h-3" />
        VIP{endDate ? ` до ${endDate}` : ""}
      </div>
    );
  }
  switch (l.promotion_type) {
    case "top":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          TOP{endDate ? ` до ${endDate}` : ""}
        </div>
      );
    case "up":
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted text-foreground text-xs font-bold">
          <ArrowUp className="w-3 h-3" />
          Поднятие{endDate ? ` до ${endDate}` : ""}
        </div>
      );
    default:
      if (l.urgent) {
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-bold">
            <Zap className="w-3 h-3" />
            Срочно
          </div>
        );
      }
      return <span className="text-xs text-muted-foreground">Без продвижения</span>;
  }
}

export default function MyListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<MyListingRow[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, title, price, photos, district, views, status, vip, promotion_type, promotion_expires_at, urgent, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (cancelled) return;
      const list = (data ?? []) as unknown as MyListingRow[];
      setRows(list);
      const paths = list.flatMap(r => r.photos ?? []).filter(isStoragePath);
      if (paths.length > 0) {
        const urls = await resolvePhotoUrls(paths);
        if (!cancelled) setPhotoUrls(urls);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, authLoading, navigate]);

  const photoOf = (l: MyListingRow): string => {
    const p = l.photos?.[0];
    if (!p) return "/placeholder.svg";
    return isStoragePath(p) ? (photoUrls[p] ?? "/placeholder.svg") : p;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={[{ label: "Мои объявления" }]} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">Мои объявления</h1>
          <Link
            to="/create"
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-accent text-accent-foreground text-sm font-bold"
          >
            <Plus className="w-4 h-4" />Разместить
          </Link>
        </div>

        {loading || authLoading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <p className="font-bold text-foreground mb-1">У вас пока нет объявлений</p>
            <p className="text-sm text-muted-foreground mb-4">Разместите первое — это займёт пару минут.</p>
            <Link to="/create" className="text-sm text-accent font-bold">Подать объявление →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(l => (
              <div key={l.id} className={`bg-card rounded-xl border ${l.vip ? "border-vip" : "border-border"} p-4 flex gap-4 items-start`}>
                <Link to={`/listing/${l.id}`} className="shrink-0">
                  <img src={photoOf(l)} alt="" className="w-24 h-18 object-cover rounded-lg" />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/listing/${l.id}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors line-clamp-1">
                      {l.title}
                    </Link>
                    {statusBadge(l.status)}
                  </div>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">{formatPrice(l.price)}</p>
                  {l.district && <p className="text-xs text-muted-foreground mt-1">{l.district}</p>}

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views}</span>
                    {l.phoneVisibleCount !== undefined && (
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phoneVisibleCount}</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  {promotionBadge(l)}
                  {!l.promotion_type && !l.vip && l.status === "active" && (
                    <Link
                      to={`/promote/${l.id}`}
                      className="px-3 py-1.5 rounded-lg bg-vip/10 text-vip text-xs font-bold hover:bg-vip/20 transition-colors flex items-center gap-1"
                    >
                      <Crown className="w-3 h-3" />
                      Продвинуть
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
