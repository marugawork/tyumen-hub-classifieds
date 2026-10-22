import { describe, it, expect } from "vitest";
import { compatibleModel, matchesCarFilters, validateCar, carFiltersFromParams } from "@/data/cars";

describe("car categories", () => {
  it("changing brand drops a model from another brand", () => {
    expect(compatibleModel("Kia", "Solaris")).toBeUndefined();
    expect(compatibleModel("Hyundai", "Solaris")).toBe("Solaris");
  });

  it("filters by brand and year range", () => {
    const car = { car_brand: "Toyota", car_model: "Camry", car_year: 2015, car_mileage: 120000, condition: "used" };
    expect(matchesCarFilters(car, { brand: "Toyota", yearMin: 2010, yearMax: 2020 })).toBe(true);
    expect(matchesCarFilters(car, { brand: "Nissan" })).toBe(false);
    expect(matchesCarFilters(car, { mileageMax: 100000 })).toBe(false);
  });

  it("old listings without car fields stay visible without filters but not under one", () => {
    expect(matchesCarFilters({}, {})).toBe(true);
    expect(matchesCarFilters({}, { brand: "Toyota" })).toBe(false);
  });

  it("used car requires mileage, new car does not", () => {
    expect(validateCar({ brand: "Лада", model: "Vesta", year: "2020", mileage: "", condition: "used" })).toBe("Укажите пробег");
    expect(validateCar({ brand: "Лада", model: "Vesta", year: "2025", mileage: "", condition: "new" })).toBeNull();
    expect(validateCar({ brand: "Лада", model: "Vesta", year: "1800", mileage: "0", condition: "used" })).toBe("Укажите корректный год выпуска");
  });

  it("URL with mismatched model resets the model", () => {
    const f = carFiltersFromParams(new URLSearchParams("brand=Kia&model=Camry&yearMin=2010"));
    expect(f).toEqual({ brand: "Kia", model: undefined, yearMin: 2010 });
  });
});
