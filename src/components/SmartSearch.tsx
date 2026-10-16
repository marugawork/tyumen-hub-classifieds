import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchListings } from "@/lib/dbListings";
import { categories } from "@/data/categories";
import type { Listing } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";

const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

export default function SmartSearch({ initialText = "", district }: { initialText?: string; district?: string }) {
  const [text, setText] = useState(initialText);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [found, setFound] = useState<{ listing: Listing; reason: string }[] | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (q.length < 3 || busy) return;
    setBusy(true);
    setError("");
    try {
      const pool = await fetchListings({ district: district || undefined, limit: 400 });
      const byId = new Map(pool.map((l) => [l.id, l]));
      const { data, error: fnError } = await supabase.functions.invoke("smart-search", {
        body: {
          query: q,
          candidates: pool.map((l) => ({ id: l.id, t: l.title, c: catName(l.categoryId), p: l.price, d: l.district })),
        },
      });
      if (fnError) {
        let msg = "Не удалось выполнить AI-поиск";
        try { msg = (await (fnError as { context?: Response }).context?.json())?.error ?? msg; } catch { /* keep default */ }
        throw new Error(msg);
      }
      const rows = ((data?.results ?? []) as { id: string; reason: string }[])
        .map((r) => ({ listing: byId.get(r.id)!, reason: r.reason }))
        .filter((r) => r.listing);
      setFound(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось выполнить AI-поиск");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-6">
      <form onSubmit={run} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Sparkles className="w-4 h-4 text-accent" /> Умный AI-поиск
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder="Опишите своими словами, что ищете: например, «недорогой детский велосипед для ребёнка 7 лет»"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={busy || text.trim().length < 3} className="font-bold">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {busy ? "Подбираем…" : "Подобрать"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>
      {found && (
        <div className="mt-4">
          {found.length === 0 ? (
            <p className="text-sm text-muted-foreground">Подходящих объявлений не нашлось — попробуйте описать иначе.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">Подобрано по смыслу: {found.length}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {found.map(({ listing, reason }) => (
                  <div key={listing.id}>
                    <ListingCard listing={listing} />
                    {reason && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{reason}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
