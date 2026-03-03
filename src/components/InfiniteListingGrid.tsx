import { type Listing } from "@/data/listings";
import ListingCard from "./ListingCard";
import AdBanner from "./AdBanner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface Props {
  listings: Listing[];
  /** Insert ad banners every N cards (default 12) */
  adInterval?: number;
}

export default function InfiniteListingGrid({ listings, adInterval = 12 }: Props) {
  const { visibleItems, hasMore, loaderRef } = useInfiniteScroll(listings);

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
