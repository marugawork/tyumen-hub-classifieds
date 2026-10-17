import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, ShieldCheck, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ListingCard from "@/components/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { fetchListings } from "@/lib/dbListings";
import type { Listing } from "@/data/listings";
import type { BusinessProfileRow } from "./BusinessDirectoryPage";

export default function BusinessPage() {
  const { id } = useParams<{ id: string }>();
  const [biz, setBiz] = useState<BusinessProfileRow | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("business_profiles")
        .select("id, user_id, name, description, logo_url, verified, deals_count, founded_year, city, district")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (!data) { setLoading(false); return; }
      const row = data as BusinessProfileRow & { user_id: string };
      setBiz(row);
      setOwnerId(row.user_id);

      const { data: rows } = await supabase
        .from("listings")
        .select("id")
        .eq("author_id", row.user_id)
        .eq("status", "active")
        .limit(50);
      if (cancelled) return;
      if (rows && rows.length > 0) {
        // Reuse DB-first fetcher and filter to this owner's ids
        const all = await fetchListings({ limit: 200 });
        const ids = new Set(rows.map(r => r.id as string));
        if (!cancelled) setListings(all.filter(l => ids.has(l.id)));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={[{ label: "Компании", href: "/business" }, { label: biz?.name ?? "Компания" }]} />

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !biz ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-bold text-foreground mb-1">Компания не найдена</p>
            <Link to="/business" className="text-sm text-accent font-semibold">← К каталогу компаний</Link>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-xl border border-border p-5 mb-6 flex gap-4 items-start">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {biz.logo_url ? (
                  <img src={biz.logo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-extrabold text-primary">{biz.name[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-foreground">{biz.name}</h1>
                  {biz.verified && (
                    <span className="flex items-center gap-1 text-xs font-bold text-success">
                      <ShieldCheck className="w-4 h-4" />Проверенная компания
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                  {biz.district && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{biz.district}</span>
                  )}
                  {biz.founded_year && (
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />На рынке с {biz.founded_year}</span>
                  )}
                </div>
                {biz.description && (
                  <p className="text-sm text-muted-foreground mt-3 whitespace-pre-line">{biz.description}</p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-bold text-foreground mb-4">
              Объявления компании{listings.length > 0 ? ` (${listings.length})` : ""}
            </h2>
            {listings.length === 0 ? (
              <p className="text-sm text-muted-foreground">У этой компании пока нет активных объявлений.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
