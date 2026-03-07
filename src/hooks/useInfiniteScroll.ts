import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_LIMIT = 20;

type ItemWithId = { id: string };

interface UseInfiniteScrollOptions {
  limit?: number;
  resetKey?: string;
}

function uniqueById<T extends ItemWithId>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

export function useInfiniteScroll<T extends ItemWithId>(allItems: T[], options: UseInfiniteScrollOptions = {}) {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const resetKey = options.resetKey ?? "";

  const sourceItems = useMemo(() => uniqueById(allItems), [allItems]);

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingLockRef = useRef(false);

  const getPageChunk = useCallback(
    (pageNumber: number) => {
      const from = (pageNumber - 1) * limit;
      const to = from + limit;
      return sourceItems.slice(from, to);
    },
    [sourceItems, limit]
  );

  const applyFirstPage = useCallback(() => {
    const firstChunk = uniqueById(getPageChunk(1));
    const nextHasMore = firstChunk.length === limit && firstChunk.length < sourceItems.length;

    setItems(firstChunk);
    setPage(1);
    setHasMore(nextHasMore);
    setIsLoading(false);
    setIsLoadingMore(false);
    loadingLockRef.current = false;

    if (import.meta.env.DEV) {
      console.debug("[feed] reset", {
        page: 1,
        source: sourceItems.length,
        loaded: firstChunk.length,
        hasMore: nextHasMore,
      });
    }
  }, [getPageChunk, limit, sourceItems.length]);

  const reset = useCallback(() => {
    setIsLoading(true);
    setItems([]);
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    loadingLockRef.current = false;

    applyFirstPage();
  }, [applyFirstPage]);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || loadingLockRef.current || !hasMore) return;

    loadingLockRef.current = true;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    const nextChunk = getPageChunk(nextPage);

    setItems(prevItems => {
      const merged = uniqueById([...prevItems, ...nextChunk]);
      const newUniqueCount = merged.length - prevItems.length;

      const isShortPage = nextChunk.length < limit;
      const noUniqueItems = newUniqueCount === 0;
      const reachedTotal = merged.length >= sourceItems.length;
      const nextHasMore = !(isShortPage || noUniqueItems || reachedTotal);

      setHasMore(nextHasMore);
      setPage(nextPage);
      setIsLoadingMore(false);
      loadingLockRef.current = false;

      if (import.meta.env.DEV) {
        console.debug("[feed] loadMore", {
          page: nextPage,
          currentItems: prevItems.length,
          chunkSize: nextChunk.length,
          newUniqueCount,
          mergedUnique: merged.length,
          hasMore: nextHasMore,
        });
      }

      return merged;
    });
  }, [getPageChunk, hasMore, isLoading, isLoadingMore, limit, page, sourceItems.length]);

  useEffect(() => {
    reset();
  }, [resetKey, sourceItems, reset]);

  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel || !hasMore) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (isLoading || isLoadingMore || loadingLockRef.current || !hasMore) return;
        loadMore();
      },
      { rootMargin: "240px" }
    );

    observerRef.current.observe(sentinel);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  return {
    visibleItems: items,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    totalCount: sourceItems.length,
    loaderRef,
    loadMore,
    reset,
  };
}

