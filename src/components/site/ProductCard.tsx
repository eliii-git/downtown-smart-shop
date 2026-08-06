import { Link } from "@tanstack/react-router";
import { Heart, Star, Truck } from "lucide-react";
import { getShop, ugx, type Product } from "@/data/marketplace";
import { TrustScore } from "./TrustScore";

export function ProductCard({ product }: { product: Product }) {
  const shop = getShop(product.shopId);

  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="surface-card hover-lift group block overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
            {product.tag}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Save to wishlist"
          onClick={(e) => e.preventDefault()}
          className="glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-w-0 text-sm font-semibold leading-snug">{product.name}</h3>
          <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {product.aiScore}
          </span>
        </div>

        <div>
          <p className="font-display text-lg font-bold">{ugx(product.retail)}</p>
          <p className="text-xs text-muted-foreground">
            Bulk {ugx(product.wholesale)} · from {product.bulkFrom} units
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {product.rating} ({product.reviews})
          </span>
          <span className="inline-flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            {product.deliveryDays}d
          </span>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3">
          <span className="truncate text-xs text-muted-foreground">{shop?.name}</span>
          {shop ? <TrustScore score={shop.trustScore} /> : null}
        </div>
      </div>
    </Link>
  );
}