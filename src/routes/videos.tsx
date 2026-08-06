import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, Play, Share2, ShoppingBag } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { getProduct, getShop, ugx, videoFeed } from "@/data/marketplace";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video Feed — Shop by Watching | DownTown Uganda" },
      {
        name: "description",
        content:
          "A vertical video feed where Kikubo shops show real stock. Like, follow, and buy straight from the clip.",
      },
      { property: "og:title", content: "Video Feed — Shop by Watching" },
      {
        property: "og:description",
        content: "Watch Kikubo shops show real stock and buy straight from the clip.",
      },
    ],
  }),
  component: Videos,
});

function Videos() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <Shell hideFooter>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Video feed</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Real stock, filmed in the stall. Swipe, follow a shop, and buy without leaving the clip.
        </p>

        <div className="no-scrollbar mt-8 flex snap-y snap-mandatory flex-col items-center gap-6 overflow-y-auto">
          {videoFeed.map((v) => {
            const shop = getShop(v.shopId);
            const product = getProduct(v.productId);
            const isLiked = liked[v.id] ?? false;

            return (
              <article
                key={v.id}
                className="relative aspect-[9/16] w-full max-w-sm shrink-0 snap-start overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-float)]"
                style={{
                  backgroundImage: `linear-gradient(160deg, oklch(0.62 0.15 ${v.hue}), oklch(0.22 0.05 ${v.hue}))`,
                }}
              >
                <span className="glass absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
                  <Play className="h-6 w-6 fill-current" />
                </span>

                <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
                  <button
                    type="button"
                    aria-label="Like"
                    onClick={() => setLiked((s) => ({ ...s, [v.id]: !isLiked }))}
                    className="flex flex-col items-center gap-1 text-white"
                  >
                    <span className="glass grid h-11 w-11 place-items-center rounded-full">
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`} />
                    </span>
                    <span className="text-[11px]">{(v.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
                  </button>
                  {[
                    [MessageCircle, v.comments.toString(), "Comment"],
                    [Share2, v.shares.toString(), "Share"],
                    [Bookmark, "Save", "Save"],
                  ].map(([Icon, label, aria]) => {
                    const C = Icon as typeof Heart;
                    return (
                      <button
                        key={aria as string}
                        type="button"
                        aria-label={aria as string}
                        className="flex flex-col items-center gap-1 text-white"
                      >
                        <span className="glass grid h-11 w-11 place-items-center rounded-full">
                          <C className="h-5 w-5" />
                        </span>
                        <span className="text-[11px]">{label as string}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 space-y-3 p-4"
                  style={{ backgroundImage: "var(--gradient-ink)" }}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <Link
                      to="/shop/$shopId"
                      params={{ shopId: v.shopId }}
                      className="min-w-0 truncate text-sm font-semibold text-white"
                    >
                      @{shop?.name}
                    </Link>
                    <button
                      type="button"
                      className="shrink-0 rounded-full border border-white/40 px-3 py-1 text-xs font-medium text-white"
                    >
                      Follow
                    </button>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-white/85">{v.caption}</p>

                  {product ? (
                    <Link
                      to="/product/$productId"
                      params={{ productId: product.id }}
                      className="glass grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2.5"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        width={800}
                        height={800}
                        className="h-11 w-11 shrink-0 rounded-xl object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-white">
                          {product.name}
                        </span>
                        <span className="block text-[11px] text-white/70">{ugx(product.retail)}</span>
                      </span>
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        style={{ backgroundImage: "var(--gradient-gold)" }}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Buy
                      </span>
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}