import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

const STORAGE_KEY = "nyu_district";

export function DistrictProvider({ children }: { children: ReactNode }) {
  const [selectedDistrict, setSelectedDistrictRaw] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const setSelectedDistrict = (d: string) => {
    setSelectedDistrictRaw(d);
    try {
      if (d) localStorage.setItem(STORAGE_KEY, d);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const districtLabel = toLabel(selectedDistrict);

  return (
    <DistrictContext.Provider value={{ selectedDistrict, setSelectedDistrict, districtLabel }}>
      {children}
    </DistrictContext.Provider>
  );
}

export function useDistrict() {
  return useContext(DistrictContext);
}
