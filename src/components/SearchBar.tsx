import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { useDistrict } from "@/contexts/DistrictContext";
import { districts, districtToSlug } from "@/data/districts";

interface SearchBarProps {
  /** Initial query value */
  initialQuery?: string;
  /** Compact mode for catalog pages (smaller height) */
  compact?: boolean;
}

export default function SearchBar({ initialQuery = "", compact = false }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { selectedDistrict, setSelectedDistrict } = useDistrict();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedDistrict) params.set("district", districtToSlug(selectedDistrict));
    navigate(`/search?${params.toString()}`);
  };

  const h = compact ? "h-11 md:h-12" : "h-14 md:h-16";
  const textSize = compact ? "text-sm md:text-base" : "text-base md:text-lg";
  const btnPx = compact ? "px-5 md:px-7" : "px-8 md:px-10";
  const rounded = compact ? "rounded-l-xl" : "rounded-l-2xl";
  const roundedR = compact ? "rounded-r-xl" : "rounded-r-2xl";

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="text"
        placeholder="Что ищете? Например: квартира, iPhone, автомобиль..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className={`flex-1 ${h} px-4 md:px-6 ${rounded} border border-r-0 border-input bg-card ${textSize} text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all`}
      />
      <div className={`relative ${h} shrink-0`}>
        <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          className={`h-full appearance-none bg-card border border-r-0 border-input pl-9 pr-8 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all`}
        >
          <option value="">Все районы</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <ChevronRight className="w-3 h-3 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
      </div>
      <button
        type="submit"
        className={`${h} ${btnPx} ${roundedR} bg-accent text-accent-foreground font-bold ${textSize} hover:bg-accent/90 transition-colors flex items-center gap-2`}
      >
        <Search className={compact ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-6 md:h-6"} />
        <span className="hidden sm:inline">Найти</span>
      </button>
    </form>
  );
}
