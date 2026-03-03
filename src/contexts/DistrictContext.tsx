import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { slugToDistrict } from "@/data/districts";

interface DistrictContextType {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  /** Human-readable label for headings, e.g. "14 микрорайон" */
  districtLabel: string;
}

const DistrictContext = createContext<DistrictContextType>({
  selectedDistrict: "",
  setSelectedDistrict: () => {},
  districtLabel: "",
});

function toLabel(district: string): string {
  if (!district) return "";
  const match = district.match(/^(\d+)\s*мкр$/);
  if (match) return `${match[1]} микрорайон`;
  return district;
}

const STORAGE_KEY = "selectedDistrict";

function readDistrictFromUrl(): string {
  try {
    const districtSlug = new URLSearchParams(window.location.search).get("district");
    if (!districtSlug) return "";
    return slugToDistrict(districtSlug) || "";
  } catch {
    return "";
  }
}

function readInitialDistrict(): string {
  const districtFromUrl = readDistrictFromUrl();
  if (districtFromUrl) return districtFromUrl;

  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function DistrictProvider({ children }: { children: ReactNode }) {
  const [selectedDistrict, setSelectedDistrictRaw] = useState<string>(() => readInitialDistrict());

  const setSelectedDistrict = useCallback((district: string) => {
    setSelectedDistrictRaw(prev => (prev === district ? prev : district));

    try {
      if (district) localStorage.setItem(STORAGE_KEY, district);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const districtFromUrl = readDistrictFromUrl();
      setSelectedDistrictRaw(prev => (prev === districtFromUrl ? prev : districtFromUrl));

      try {
        if (districtFromUrl) localStorage.setItem(STORAGE_KEY, districtFromUrl);
        else localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const districtLabel = toLabel(selectedDistrict);

  const value = useMemo(
    () => ({ selectedDistrict, setSelectedDistrict, districtLabel }),
    [selectedDistrict, setSelectedDistrict, districtLabel]
  );

  return <DistrictContext.Provider value={value}>{children}</DistrictContext.Provider>;
}

export function useDistrict() {
  return useContext(DistrictContext);
}

