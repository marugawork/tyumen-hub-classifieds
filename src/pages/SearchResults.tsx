import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FilterPanel, { type FilterValues } from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import InfiniteListingGrid from "@/components/InfiniteListingGrid";
import { filterListings } from "@/data/listings";
import { useDistrict } from "@/contexts/DistrictContext";
import { slugToDistrict } from "@/data/districts";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const districtSlugParam = searchParams.get("district") || "";
  const { selectedDistrict, setSelectedDistrict, districtLabel } = useDistrict();

  useEffect(() => {
    if (!districtSlugParam) return;
    const districtFromUrl = slugToDistrict(districtSlugParam);
    if (districtFromUrl) setSelectedDistrict(districtFromUrl);
  }, [districtSlugParam, setSelectedDistrict]);

  const [filters, setFilters] = useState<FilterValues>({ sortBy: "date", district: selectedDistrict || undefined });

  useEffect(() => {
    setFilters(prev => ({ ...prev, district: selectedDistrict || undefined }));
  }, [selectedDistrict]);

  const handleFiltersChange = (nextFilters: FilterValues) => {
    setFilters(nextFilters);
    const nextDistrict = nextFilters.district || "";
    if (nextDistrict !== selectedDistrict) setSelectedDistrict(nextDistrict);
  };

  const results = useMemo(() => filterListings({ ...filters, query }), [filters, query]);

  const suffix = districtLabel ? ` — ${districtLabel}` : "";

  const title = query ? `Результаты: «${query}»${suffix}` : `Все объявления${suffix}`;

  const crumbLabel = query ? `Поиск: «${query}»${suffix}` : `Все объявления${suffix}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <div className="mb-6">
          <SearchBar compact initialQuery={query} />
        </div>
        <BreadcrumbNav crumbs={[
          ...(districtLabel ? [{ label: "Нефтеюганск", href: "/" }] : []),
          { label: crumbLabel },
        ]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground mb-4">Найдено {results.length} объявлений</p>
        <FilterPanel filters={filters} onChange={handleFiltersChange} />
        <div className="mt-4">
          <InfiniteListingGrid listings={results} />
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
