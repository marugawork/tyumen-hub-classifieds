import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PAGE_SIZE = 12;

export function useInfiniteScroll<T extends { id: string }>(allItems: T[]) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  // Stable fingerprint: use sorted first few IDs + length
  const itemsKey = useMemo(() => {
    const ids = allItems.slice(0, 5).map(i => i.id).join(",");
    return `${allItems.length}:${ids}`;
  }, [allItems]);

  const prevKeyRef = useRef(itemsKey);

  // Reset when items change (district/filter/category switch)
  useEffect(() => {
    if (prevKeyRef.current !== itemsKey) {
      setVisibleCount(PAGE_SIZE);
      prevKeyRef.current = itemsKey;
    }
  }, [itemsKey]);

  // Deduplicate by id
  const deduped = useMemo(() => {
    const seen = new Set<string>();
    return allItems.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [allItems]);

  const visibleItems = deduped.slice(0, visibleCount);
  const hasMore = visibleCount < deduped.length;

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setVisibleCount(prev => {
      const next = Math.min(prev + PAGE_SIZE, deduped.length);
      return next;
    });
    // Release lock after state update
    requestAnimationFrame(() => {
      isLoadingRef.current = false;
    });
  }, [deduped.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return {
    visibleItems,
    hasMore,
    loaderRef,
    totalCount: deduped.length,
    reset: () => setVisibleCount(PAGE_SIZE),
  };
}
