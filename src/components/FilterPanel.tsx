import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { categories } from "@/data/categories";
import { districts } from "@/data/districts";
import { Button } from "@/components/ui/button";

export interface FilterValues {
  categoryId?: string;
  subcategoryId?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: "new" | "used";
  authorType?: "private" | "business";
  district?: string;
  urgent?: boolean;
  bargain?: boolean;
  delivery?: boolean;
  sortBy: "date" | "price_asc" | "price_desc" | "popular";
}

interface FilterPanelProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  showCategory?: boolean;
}

export default function FilterPanel({ filters, onChange, showCategory = true }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCat = categories.find(c => c.id === filters.categoryId);

  const update = (partial: Partial<FilterValues>) => {
    onChange({ ...filters, ...partial });
  };

  const clearAll = () => {
    onChange({
      sortBy: "date",
      categoryId: filters.categoryId,
      subcategoryId: filters.subcategoryId,
    });
  };

  const hasFilters = filters.priceMin || filters.priceMax || filters.condition || filters.authorType || filters.district || filters.urgent || filters.bargain || filters.delivery;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Sort bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={e => update({ sortBy: e.target.value as FilterValues["sortBy"] })}
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="date">По дате</option>
            <option value="price_asc">Дешевле</option>
            <option value="price_desc">Дороже</option>
            <option value="popular">По популярности</option>
          </select>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Фильтры
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-accent" />
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filter panel */}
      {isOpen && (
        <div className="space-y-4 pt-3 border-t border-border animate-fade-in">
          {/* Category */}
          {showCategory && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Категория</label>
              <select
                value={filters.categoryId || ""}
                onChange={e => update({ categoryId: e.target.value || undefined, subcategoryId: undefined })}
                className="mt-1 w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
              >
                <option value="">Все категории</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Subcategory */}
          {selectedCat && selectedCat.subcategories.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Подкатегория</label>
              <select
                value={filters.subcategoryId || ""}
                onChange={e => update({ subcategoryId: e.target.value || undefined })}
                className="mt-1 w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
              >
                <option value="">Все</option>
                {selectedCat.subcategories.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Цена, ₽</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                placeholder="от"
                value={filters.priceMin || ""}
                onChange={e => update({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
              />
              <input
                type="number"
                placeholder="до"
                value={filters.priceMax || ""}
                onChange={e => update({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Состояние</label>
            <div className="flex gap-2 mt-1">
              {[
                { value: undefined, label: "Любое" },
                { value: "new" as const, label: "Новое" },
                { value: "used" as const, label: "Б/у" },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => update({ condition: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    filters.condition === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* District */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Район</label>
            <select
              value={filters.district || ""}
              onChange={e => update({ district: e.target.value || undefined })}
              className="mt-1 w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
            >
              <option value="">Все районы</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Seller type */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Продавец</label>
            <div className="flex gap-2 mt-1">
              {[
                { value: undefined, label: "Все" },
                { value: "private" as const, label: "Частник" },
                { value: "business" as const, label: "Бизнес" },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => update({ authorType: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    filters.authorType === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "urgent" as const, label: "Срочно" },
              { key: "bargain" as const, label: "Торг" },
              { key: "delivery" as const, label: "Доставка" },
            ].map(flag => (
              <button
                key={flag.key}
                onClick={() => update({ [flag.key]: filters[flag.key] ? undefined : true })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  filters[flag.key]
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-input hover:border-primary/50"
                }`}
              >
                {flag.label}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              <X className="w-3 h-3" /> Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}
