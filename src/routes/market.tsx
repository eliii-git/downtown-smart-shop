import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { ProductCard } from "@/components/site/ProductCard";
import { AISearchBar } from "@/components/site/AISearchBar";
import { categories, products } from "@/data/marketplace";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Marketplace — Kikubo Wholesale & Retail | DownTown Uganda" },
      {
        name: "description",
        content:
          "Browse electronics, fabric, kitchenware and more from verified Kikubo shops. Compare retail and wholesale prices, warranty and delivery.",
      },
      { property: "og:title", content: "Marketplace — Kikubo Wholesale & Retail" },
      {
        property: "og:description",
        content: "Compare retail and bulk prices from verified Kikubo shops on DownTown Uganda.",
      },
    ],
  }),
  component: Market,
});

const sorts = ["AI score", "Price: low to high", "Price: high to low", "Top rated"] as const;

function Market() {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<(typeof sorts)[number]>("AI score");

  const list = useMemo(() => {
    const filtered =
      category === "All" ? products : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    if (sort === "Price: low to high") sorted.sort((a, b) => a.retail - b.retail);
    if (sort === "Price: high to low") sorted.sort((a, b) => b.retail - a.retail);
    if (sort === "Top rated") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "AI score") sorted.sort((a, b) => b.aiScore - a.aiScore);
    return sorted;
  }, [category, sort]);

  const chips = ["All", ...categories.map((c) => c.name)];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Marketplace</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Every listing shows retail price, bulk break points, warranty, delivery cost and the
          seller's trust score.
        </p>

        <div className="mt-6 max-w-2xl">
          <AISearchBar />
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            {list.length} product{list.length === 1 ? "" : "s"}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              aria-label="Sort products"
              onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none"
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </Shell>
  );
}