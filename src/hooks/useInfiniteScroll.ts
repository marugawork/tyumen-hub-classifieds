import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const PAGE_SIZE = 12;

interface UseInfiniteScrollOptions {
  limit?: number;
  resetKey?: string;
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function useInfiniteScroll<T extends { id: string }>(
  allItems: T[],
  options: UseInfiniteScrollOptions = {}
) {
  const limit = options.limit ?? PAGE_SIZE;
  const externalResetKey = options.resetKey ?? "";

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  const sourceItems = useMemo(() => uniqueById(allItems), [allItems]);
  const sourceSignature = useMemo(() => sourceItems.map(item => item.id).join("|"), [sourceItems]);
  const resetFingerprint = `${externalResetKey}:${sourceItems.length}:${sourceSignature}`;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const logDebug = useCallback((event: string, payload: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.debug(`[infinite-scroll] ${event}`, payload);
    }
  }, []);

  const getPageItems = useCallback(
    (nextPage: number) => {
      const start = (nextPage - 1) * limit;
      return sourceItems.slice(start, start + limit);
    },
    [limit, sourceItems]
  );

  const reset = useCallback(
    (reason = "manual") => {
      setIsLoading(true);
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;

      const firstBatch = getPageItems(1);
      const initialItems = uniqueById(firstBatch);
      const nextHasMore = firstBatch.length >= limit && initialItems.length < sourceItems.length;

      setItems(initialItems);
      setPage(1);
      setHasMore(nextHasMore);
      setIsLoading(false);

      logDebug("reset", {
        reason,
        page: 1,
        totalSource: sourceItems.length,
        loaded: firstBatch.length,
        unique: initialItems.length,
        hasMore: nextHasMore,
      });
    },
    [getPageItems, limit, logDebug, sourceItems.length]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    const nextBatch = getPageItems(nextPage);
    const mergedItems = uniqueById([...items, ...nextBatch]);
    const newUniqueCount = mergedItems.length - items.length;

    const reachedEndBySize = nextBatch.length < limit;
    const reachedEndByDedup = newUniqueCount === 0;
    const reachedEndBySource = mergedItems.length >= sourceItems.length;
    const nextHasMore = !reachedEndBySize && !reachedEndByDedup && !reachedEndBySource;

    setItems(mergedItems);
    setPage(nextPage);
    setHasMore(nextHasMore);

    logDebug("load_more", {
      page: nextPage,
      loaded: nextBatch.length,
      newUnique: newUniqueCount,
      uniqueTotal: mergedItems.length,
      hasMore: nextHasMore,
    });

    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  }, [getPageItems, hasMore, isLoading, items, limit, logDebug, page, sourceItems.length]);

  useEffect(() => {
    reset("filters_or_source_changed");
  }, [resetFingerprint, reset]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) return;
        if (isLoading || isLoadingMoreRef.current || !hasMore) return;
        loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return {
    visibleItems: items,
    hasMore,
    loaderRef,
    totalCount: sourceItems.length,
    page,
    isLoading,
    isLoadingMore,
    reset,
  };
}

