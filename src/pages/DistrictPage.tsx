import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ListingCard from "@/components/ListingCard";
import FilterPanel, { type FilterValues } from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import { filterListings } from "@/data/listings";
import { slugToDistrict } from "@/data/districts";
import { useDistrict } from "@/contexts/DistrictContext";
import NotFound from "./NotFound";

export default function DistrictPage() {
  const { slug } = useParams<{ slug: string }>();
  const districtName = slug ? slugToDistrict(slug) : undefined;
  const { setSelectedDistrict, districtLabel } = useDistrict();
  const [filters, setFilters] = useState<FilterValues>({ sortBy: "date" });

  // Sync global filter when visiting district page
  useEffect(() => {
    if (districtName) setSelectedDistrict(districtName);
  }, [districtName, setSelectedDistrict]);

  const results = useMemo(
    () => districtName ? filterListings({ ...filters, district: districtName }) : [],
    [filters, districtName]
  );

  if (!districtName) return <NotFound />;

  const label = districtLabel || districtName;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <div className="mb-6">
          <SearchBar compact />
        </div>
        <BreadcrumbNav crumbs={[
          { label: "Нефтеюганск", href: "/" },
          { label: label },
        ]} />
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Объявления — {label}
        </h1>
        <p className="text-sm text-muted-foreground mb-4">Найдено {results.length} объявлений</p>
        <FilterPanel filters={filters} onChange={setFilters} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
        {results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-1">В этом районе пока нет объявлений</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
