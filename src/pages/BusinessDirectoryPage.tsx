import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Search, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { supabase } from "@/integrations/supabase/client";
import { useDistrict } from "@/contexts/DistrictContext";

export interface BusinessProfileRow {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  verified: boolean;
  deals_count: number;
  founded_year: number | null;
  city: string;
  district: string | null;
}

export default function BusinessDirectoryPage() {
  const [rows, setRows] = useState<BusinessProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { selectedDistrict } = useDistrict();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("business_profiles")
        .select("id, name, description, logo_url, verified, deals_count, founded_year, city, district")
        .order("verified", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (!cancelled) {
        setRows((data ?? []) as BusinessProfileRow[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = rows;
    if (selectedDistrict) list = list.filter(b => b.district === selectedDistrict);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    return list;
  }, [rows, query, selectedDistrict]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={[{ label: "Компании" }]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Компании Нефтеюганска{selectedDistrict ? ` — ${selectedDistrict}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">Местный бизнес и услуги с проверенными профилями</p>

        {/* Search */}
        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Найти компанию или услугу…"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center">
            <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-bold text-foreground mb-1">Пока нет компаний</p>
            <p className="text-sm text-muted-foreground">
              {rows.length === 0
                ? "Каталог только запускается. Если у вас есть бизнес — создайте профиль в личном кабинете."
                : "По вашему запросу ничего не найдено. Попробуйте изменить поиск или район."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(b => (
              <Link
                key={b.id}
                to={`/business/${b.id}`}
                className="bg-card rounded-xl border border-border p-4 flex gap-3 items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {b.logo_url ? (
                    <img src={b.logo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-lg font-extrabold text-primary">{b.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-foreground truncate">{b.name}</span>
                    {b.verified && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
                  </div>
                  {b.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{b.description}</p>
                  )}
                  {b.district && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{b.district}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
