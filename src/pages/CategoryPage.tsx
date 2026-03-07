import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FilterPanel, { type FilterValues } from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import InfiniteListingGrid from "@/components/InfiniteListingGrid";
import AdBanner from "@/components/AdBanner";
import { getCategoryBySlug, getSubcategoryBySlug, categories } from "@/data/categories";
import { filterListings, listings } from "@/data/listings";
import { slugToDistrict } from "@/data/districts";
import { useDistrict } from "@/contexts/DistrictContext";

export default function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const districtSlugParam = searchParams.get("district") || "";
  const { selectedDistrict, districtLabel, setSelectedDistrict } = useDistrict();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const subcategory = category && subcategorySlug ? getSubcategoryBySlug(categorySlug!, subcategorySlug) : undefined;

  useEffect(() => {
    if (!districtSlugParam) return;
    const districtFromUrl = slugToDistrict(districtSlugParam);
    if (districtFromUrl) setSelectedDistrict(districtFromUrl);
  }, [districtSlugParam, setSelectedDistrict]);

  const [filters, setFilters] = useState<FilterValues>({
    categoryId: category?.id,
    subcategoryId: subcategory?.id,
    district: selectedDistrict || undefined,
    sortBy: "date",
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, district: selectedDistrict || undefined }));
  }, [selectedDistrict]);

  const handleFiltersChange = (nextFilters: FilterValues) => {
    setFilters(nextFilters);
    const nextDistrict = nextFilters.district || "";
    if (nextDistrict !== selectedDistrict) setSelectedDistrict(nextDistrict);
  };

  const results = useMemo(() => filterListings({
    ...filters,
    categoryId: category?.id,
    subcategoryId: subcategory?.id || filters.subcategoryId,
  }), [filters, category, subcategory]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main pt-4 mb-2">
        <AdBanner format="horizontal" />
      </div>
      <div className="container-main py-6">
        <div className="mb-6">
          <SearchBar compact />
        </div>
        <BreadcrumbNav crumbs={[{ label: "Все категории" }]} />
          <h1 className="text-2xl font-extrabold text-foreground mb-6">Все категории</h1>
          <div className="space-y-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              const count = listings.filter(l => l.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="bg-card rounded-xl border border-border p-5">
                  <Link to={`/category/${cat.slug}`} className="flex items-center gap-3 mb-3 group">
                    <Icon className="w-6 h-6" style={{ color: `hsl(var(--cat-${cat.colorVar.replace("cat-", "")}))` }} />
                    <div>
                      <h2 className="font-extrabold text-foreground group-hover:text-accent transition-colors">{cat.name}</h2>
                      <span className="text-xs text-muted-foreground">{count} объявлений</span>
                    </div>
                  </Link>
                  {cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-9">
                      {cat.subcategories.map(sub => (
                        <Link key={sub.id} to={`/category/${cat.slug}/${sub.slug}`} className="text-sm text-accent hover:text-accent/80 transition-colors">{sub.name}</Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = category.icon;
  const catName = subcategory ? subcategory.name : category.name;
  const suffix = districtLabel ? ` — ${districtLabel}` : "";
  const headingName = `${catName}${suffix}`;

  const crumbs = [
    ...(districtLabel ? [{ label: "Нефтеюганск", href: "/" }] : []),
    ...(districtLabel ? [{ label: districtLabel }] : []),
  ];
  if (subcategory) {
    crumbs.push({ label: category.name, href: `/category/${category.slug}` });
    crumbs.push({ label: subcategory.name });
  } else {
    crumbs.push({ label: category.name });
  }

  const infiniteResetKey = useMemo(
    () => JSON.stringify({ categoryId: category?.id, subcategoryId: subcategory?.id || filters.subcategoryId, ...filters }),
    [category?.id, subcategory?.id, filters]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main pt-4 mb-2">
        <AdBanner format="horizontal" />
      </div>
      <div className="container-main py-6">
        <div className="mb-6">
          <SearchBar compact />
        </div>
        <BreadcrumbNav crumbs={crumbs} />
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6" style={{ color: `hsl(var(--cat-${category.colorVar.replace("cat-", "")}))` }} />
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{headingName}</h1>
            <p className="text-sm text-muted-foreground">{results.length} объявлений</p>
          </div>
        </div>
        {!subcategory && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category.subcategories.map(sub => (
              <Link key={sub.id} to={`/category/${category.slug}/${sub.slug}`}
                className="px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:border-accent/50 transition-colors">{sub.name}</Link>
            ))}
          </div>
        )}
        <FilterPanel filters={filters} onChange={handleFiltersChange} showCategory={false} />
        <div className="mt-4">
          <InfiniteListingGrid listings={results} />
        </div>
        {results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Объявления не найдены</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
