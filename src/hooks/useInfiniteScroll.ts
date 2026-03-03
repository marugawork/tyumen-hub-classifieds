import { useState, useEffect, useRef, useCallback } from "react";

const PAGE_SIZE = 12;

export function useInfiniteScroll<T>(allItems: T[]) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const prevKeyRef = useRef<string>("");

  // Reset when items change (district/filter switch)
  const itemsKey = allItems.length.toString() + (allItems[0] as any)?.id;
  useEffect(() => {
    if (prevKeyRef.current !== itemsKey) {
      setVisibleCount(PAGE_SIZE);
      prevKeyRef.current = itemsKey;
    }
  }, [itemsKey]);

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, allItems.length));
  }, [allItems.length]);

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

  return { visibleItems, hasMore, loaderRef, reset: () => setVisibleCount(PAGE_SIZE) };
}
