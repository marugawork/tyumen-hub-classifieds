import { useEffect, useRef, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { CarFilterFields } from "@/components/CarFields";
import { carFiltersFromParams, writeCarFilters } from "@/data/cars";
import { fetchCarPage, CAR_PAGE_SIZE } from "@/lib/dbListings";
import { useDistrict } from "@/contexts/DistrictContext";
import ListingCard from "@/components/ListingCard";
import AdBanner from "@/components/AdBanner";
import { Button } from "@/components/ui/button";

export default function CarListings() {
  const [params, setParams] = useSearchParams();
  const { selectedDistrict } = useDistrict();
  const filters = carFiltersFromParams(params);
  const numberParam = (key: string) => { const v = params.get(key); return v && Number.isFinite(Number(v)) ? Number(v) : undefined; };
  const queryFilters = { ...filters, district: selectedDistrict || undefined, priceMin: numberParam("priceMin"), priceMax: numberParam("priceMax"), sortBy: params.get("sort") || "date" };
  const feed = useInfiniteQuery({
    queryKey: ["cars", queryFilters], initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchCarPage(queryFilters, pageParam),
    getNextPageParam: (last, pages) => pages.length * CAR_PAGE_SIZE < last.total ? pages.length : undefined,
  });
  const loader = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = loader.current;
    if (!node || !feed.hasNextPage || feed.isFetchingNextPage || feed.isError) return;
    const observer = new IntersectionObserver(entries => { if (entries[0]?.isIntersecting) void feed.fetchNextPage(); }, { rootMargin: "300px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage, feed.isError]);
  const items = useMemo(() => {
    const seen = new Set<string>();
    return (feed.data?.pages.flatMap(p => p.listings) ?? []).filter(l => { if (seen.has(l.id)) return false; seen.add(l.id); return true; });
  }, [feed.data]);
  const setParam = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };
  const reset = () => { const next = writeCarFilters(params, {}); ['priceMin', 'priceMax', 'sort'].forEach(k => next.delete(k)); setParams(next, { replace: true }); };
  return <>
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <CarFilterFields value={filters} onChange={f => setParams(writeCarFilters(params, f), { replace: true })} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([['priceMin', 'Цена от, ₽'], ['priceMax', 'Цена до, ₽']] as const).map(([key, label]) => <label key={key} className="text-sm font-bold text-foreground">{label}<input aria-label={label} type="number" min={0} value={params.get(key) ?? ''} onChange={e => setParam(key, e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-input bg-background text-sm text-foreground" /></label>)}
        <label className="text-sm font-bold text-foreground">Сортировка<select aria-label="Сортировка автомобилей" value={queryFilters.sortBy} onChange={e => setParam('sort', e.target.value)} className="mt-1 w-full h-11 px-3 rounded-xl border border-input bg-background text-sm text-foreground"><option value="date">По дате</option><option value="price_asc">Дешевле</option><option value="price_desc">Дороже</option><option value="popular">По популярности</option></select></label>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>Сбросить фильтры</Button>
    </div>
    <p className="text-sm text-muted-foreground my-4">{feed.data?.pages[0]?.total ?? 0} объявлений</p>
    {feed.isPending && <p className="text-center py-16 text-muted-foreground">Загрузка…</p>}
    {feed.isError && <div className="py-8 text-center text-muted-foreground"><p>Не удалось загрузить объявления</p><Button variant="outline" className="mt-3" onClick={() => void feed.refetch()}>Повторить</Button></div>}
    {!feed.isPending && !feed.isError && items.length === 0 && <p className="text-center py-16 text-muted-foreground">Объявления не найдены</p>}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{items.map((l, i) => <div key={l.id} className="contents"><ListingCard listing={l} />{(i + 1) % 12 === 0 && <div className="col-span-2 md:col-span-3 lg:col-span-4"><AdBanner format="inline" /></div>}</div>)}</div>
    {feed.hasNextPage && <div ref={loader} className="text-center py-8"><Button variant="outline" disabled={feed.isFetchingNextPage} onClick={() => void feed.fetchNextPage()}>{feed.isFetchingNextPage ? 'Загрузка…' : 'Показать ещё'}</Button></div>}
    {!feed.hasNextPage && items.length > 0 && <p className="text-center py-8 text-sm text-muted-foreground">Вы просмотрели все объявления</p>}
  </>;
}