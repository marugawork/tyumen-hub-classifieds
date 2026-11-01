import { brandNames, modelsFor, OTHER, bodyTypes, transmissions, engines, drives, type CarFilters } from "@/data/cars";

export interface CarForm {
  brand: string; model: string; customBrand: string; customModel: string;
  year: string; mileage: string; body: string; transmission: string; engine: string; drive: string;
}
export const emptyCarForm: CarForm = { brand: "", model: "", customBrand: "", customModel: "", year: "", mileage: "", body: "", transmission: "", engine: "", drive: "" };
const control = "mt-1 w-full min-w-0 h-11 px-3 rounded-xl border border-input bg-background text-sm text-foreground";

function SelectField({ label, value, options, onChange, disabled = false, placeholder = "Любой" }: { label: string; value?: string; options: string[]; onChange: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  return <label className="block min-w-0 text-sm font-bold text-foreground">{label}<select aria-label={label} className={control} value={value ?? ""} disabled={disabled} onChange={e => onChange(e.target.value)}><option value="">{placeholder}</option>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></label>;
}
function NumberField({ label, value, onChange, max, min = 0 }: { label: string; value?: string | number; onChange: (v: string) => void; max?: number; min?: number }) {
  return <label className="block min-w-0 text-sm font-bold text-foreground">{label}<input aria-label={label} type="number" min={min} max={max} step={1} className={control} value={value ?? ""} onChange={e => onChange(e.target.value)} /></label>;
}

export function CarFormFields({ value: c, onChange }: { value: CarForm; onChange: (c: CarForm) => void }) {
  const update = (p: Partial<CarForm>) => onChange({ ...c, ...p });
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <SelectField label="Марка *" placeholder="Выберите марку" value={c.brand} options={[...brandNames, OTHER]} onChange={brand => update({ brand, model: "", customBrand: "", customModel: "" })} />
    {c.brand === OTHER && <label className="text-sm font-bold text-foreground">Название марки *<input aria-label="Название марки" maxLength={60} className={control} value={c.customBrand} onChange={e => update({ customBrand: e.target.value })} /></label>}
    <SelectField label="Модель *" placeholder="Выберите модель" value={c.model} options={[...modelsFor(c.brand), OTHER]} disabled={!c.brand} onChange={model => update({ model, customModel: "" })} />
    {c.model === OTHER && <label className="text-sm font-bold text-foreground">Название модели *<input aria-label="Название модели" maxLength={80} className={control} value={c.customModel} onChange={e => update({ customModel: e.target.value })} /></label>}
    <NumberField label="Год выпуска *" value={c.year} min={1900} max={new Date().getFullYear() + 1} onChange={year => update({ year })} />
    <NumberField label="Пробег, км" value={c.mileage} max={5000000} onChange={mileage => update({ mileage })} />
    {([['body', 'Кузов', bodyTypes], ['transmission', 'Коробка передач', transmissions], ['engine', 'Двигатель', engines], ['drive', 'Привод', drives]] as const).map(([key, label, options]) => <SelectField key={key} label={label} value={c[key]} options={options} placeholder="Выберите" onChange={v => update({ [key]: v })} />)}
  </div>;
}

export function CarFilterFields({ value: f, onChange, brands = brandNames, models }: { value: CarFilters; onChange: (f: CarFilters) => void; brands?: string[]; models?: string[] }) {
  const update = (p: Partial<CarFilters>) => onChange({ ...f, ...p });
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <SelectField label="Марка" value={f.brand} options={brands} onChange={brand => update({ brand: brand || undefined, model: undefined })} />
    <SelectField label="Модель" value={f.model} options={models ?? modelsFor(f.brand)} disabled={!f.brand} onChange={model => update({ model: model || undefined })} />
    <label className="text-sm font-bold text-foreground">Состояние<select aria-label="Состояние автомобиля" className={control} value={f.condition ?? ""} onChange={e => update({ condition: e.target.value === 'new' ? 'new' : e.target.value === 'used' ? 'used' : undefined })}><option value="">Все</option><option value="used">С пробегом</option><option value="new">Новый</option></select></label>
    <NumberField label="Год от" value={f.yearMin} min={1900} onChange={v => update({ yearMin: v ? Number(v) : undefined })} />
    <NumberField label="Год до" value={f.yearMax} min={1900} onChange={v => update({ yearMax: v ? Number(v) : undefined })} />
    <NumberField label="Пробег до, км" value={f.mileageMax} onChange={v => update({ mileageMax: v ? Number(v) : undefined })} />
    {([['body', 'Кузов', bodyTypes], ['transmission', 'Коробка передач', transmissions], ['engine', 'Двигатель', engines], ['drive', 'Привод', drives]] as const).map(([key, label, options]) => <SelectField key={key} label={label} value={f[key]} options={options} onChange={v => update({ [key]: v || undefined })} />)}
  </div>;
}