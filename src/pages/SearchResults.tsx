import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ListingCard from "@/components/ListingCard";
import FilterPanel, { type FilterValues } from "@/components/FilterPanel";
import { filterListings } from "@/data/listings";
import { useDistrict } from "@/contexts/DistrictContext";
import { slugToDistrict } from "@/data/districts";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const districtSlugParam = searchParams.get("district") || "";
  const { selectedDistrict, districtLabel } = useDistrict();

  // Resolve district: URL param takes priority, then global
  const districtFromUrl = districtSlugParam ? slugToDistrict(districtSlugParam) : undefined;
  const activeDistrict = districtFromUrl || selectedDistrict || "";

  const [filters, setFilters] = useState<FilterValues>({ sortBy: "date", district: activeDistrict || undefined });

  useEffect(() => {
    setFilters(f => ({ ...f, district: activeDistrict || undefined }));
  }, [activeDistrict]);

  const results = useMemo(() => filterListings({ ...filters, query }), [filters, query]);

  const label = activeDistrict
    ? (() => { const m = activeDistrict.match(/^(\d+)\s*мкр$/); return m ? `${m[1]} микрорайон` : activeDistrict; })()
    : "";

  const title = label
    ? query ? `Результаты поиска в ${label}е` : `Объявления — ${label}`
    : query ? `Результаты: «${query}»` : "Все объявления";

  const crumbLabel = label
    ? query ? `Поиск в ${label}е: «${query}»` : label
    : query ? `Поиск: «${query}»` : "Все объявления";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <BreadcrumbNav crumbs={[
          ...(label ? [{ label: "Нефтеюганск", href: "/" }] : []),
          { label: crumbLabel },
        ]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground mb-4">Найдено {results.length} объявлений</p>
        <FilterPanel filters={filters} onChange={setFilters} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
        {results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1">Попробуйте изменить запрос или фильтры</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
