import { useMemo } from "react";
import { type Listing } from "@/data/listings";
import ListingCard from "./ListingCard";
import AdBanner from "./AdBanner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface Props {
  listings: Listing[];
  /** Insert ad banners every N cards (default 12) */
  adInterval?: number;
  /** Insert promoted listing every N cards (default 8) */
  promotedInterval?: number;
}

export default function InfiniteListingGrid({
  listings,
  adInterval = 12,
  promotedInterval = 8,
}: Props) {
  // Separate promoted/vip from normal, avoiding duplicates
  const { promoted, normal } = useMemo(() => {
    const promotedSet = listings.filter(
      l => l.promotion_type === "vip" || l.promotion_type === "top" || l.promotion_type === "urgent"
    );
    const normalSet = listings.filter(
      l => !l.promotion_type || l.promotion_type === null
    );
    return { promoted: promotedSet, normal: normalSet };
  }, [listings]);

  // Merge: insert 1 promoted every promotedInterval normal cards
  const merged = useMemo(() => {
    const result: Listing[] = [];
    const usedIds = new Set<string>();
    let promoIdx = 0;

    for (let i = 0; i < normal.length; i++) {
      if (usedIds.has(normal[i].id)) continue;
      usedIds.add(normal[i].id);
      result.push(normal[i]);

      // After every promotedInterval normal cards, insert a promoted one
      if ((i + 1) % promotedInterval === 0 && promoIdx < promoted.length) {
        while (promoIdx < promoted.length && usedIds.has(promoted[promoIdx].id)) {
          promoIdx++;
        }
        if (promoIdx < promoted.length) {
          usedIds.add(promoted[promoIdx].id);
          result.push(promoted[promoIdx]);
          promoIdx++;
        }
      }
    }
    return result;
  }, [normal, promoted, promotedInterval]);

  const { visibleItems, hasMore, loaderRef } = useInfiniteScroll(merged);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleItems.map((l, i) => (
          <div key={l.id} className="contents">
            <ListingCard listing={l} />
            {/* Ad banner after every adInterval cards */}
            {(i + 1) % adInterval === 0 && i < visibleItems.length - 1 && (
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <AdBanner format="inline" />
              </div>
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="text-center py-8 text-sm text-muted-foreground">
          Загрузка…
        </div>
      )}
    </>
  );
}
