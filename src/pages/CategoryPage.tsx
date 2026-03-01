import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ListingCard from "@/components/ListingCard";
import FilterPanel, { type FilterValues } from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import { getCategoryBySlug, getSubcategoryBySlug, categories } from "@/data/categories";
import { filterListings, listings } from "@/data/listings";
import { useDistrict } from "@/contexts/DistrictContext";

export default function CategoryPage() {
  const { categorySlug, subcategorySlug } = useParams();
  const { selectedDistrict, districtLabel } = useDistrict();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const subcategory = category && subcategorySlug ? getSubcategoryBySlug(categorySlug!, subcategorySlug) : undefined;

  const [filters, setFilters] = useState<FilterValues>({
    categoryId: category?.id, subcategoryId: subcategory?.id, sortBy: "date",
  });

  const results = useMemo(() => filterListings({
    ...filters,
    categoryId: category?.id,
    subcategoryId: subcategory?.id || filters.subcategoryId,
    district: selectedDistrict || filters.district,
  }), [filters, category, subcategory, selectedDistrict]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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
  const headingName = districtLabel ? `${catName} — ${districtLabel}` : catName;

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
        <FilterPanel filters={filters} onChange={setFilters} showCategory={false} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(l => <ListingCard key={l.id} listing={l} />)}
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
