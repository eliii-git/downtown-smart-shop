import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Share2, ShieldCheck, Star, Truck } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { TrustScore } from "@/components/site/TrustScore";
import { getProduct, getShop, products, ugx, type Product } from "@/data/marketplace";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.product.name ?? "Product";
    const desc = loaderData?.product.aiVerdict ?? "Compare Kikubo wholesale listings.";
    return {
      meta: [
        { title: `${name} | DownTown Uganda` },
        { name: "description", content: desc },
        { property: "og:title", content: name },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const shop = getShop(product.shopId);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="surface-card overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {product.category}
            </span>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {product.rating} ({product.reviews} reviews)
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                {product.authenticity}
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="h-4 w-4" />
                {product.deliveryDays} day · {ugx(product.deliveryCost)}
              </span>
            </div>

            <div className="surface-card mt-6 p-5">
              <p className="font-display text-3xl font-bold">{ugx(product.retail)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Bulk price {ugx(product.wholesale)} from {product.bulkFrom} units ·{" "}
                {product.stock} in stock
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/checkout/$productId"
                  params={{ productId: product.id }}
                  className="inline-flex flex-1 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  Buy now
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Chat with seller
                </button>
                <button
                  type="button"
                  aria-label="Save"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border transition-colors hover:bg-secondary"
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Share"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border transition-colors hover:bg-secondary"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="surface-card mt-4 p-5"
              style={{ backgroundImage: "var(--gradient-aurora)" }}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <h2 className="min-w-0 text-sm font-semibold">AI verdict</h2>
                <span className="shrink-0 rounded-md bg-background/70 px-2.5 py-1 text-xs font-bold">
                  {product.aiScore}/100
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.aiVerdict}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-success">Pros</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                    {product.pros.map((p) => (
                      <li key={p}>+ {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-destructive">Cons</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                    {product.cons.map((c) => (
                      <li key={c}>− {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {shop ? (
              <Link
                to="/shop/$shopId"
                params={{ shopId: shop.id }}
                className="surface-card hover-lift mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display font-bold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  {shop.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{shop.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {shop.location} · replies in ~{shop.responseMins} min
                  </span>
                </span>
                <TrustScore score={shop.trustScore} />
              </Link>
            ) : null}

            <div className="surface-card mt-4 p-5">
              <h2 className="text-sm font-semibold">Specifications</h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border py-1.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="text-xs font-medium">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 border-b border-border py-1.5">
                  <dt className="text-xs text-muted-foreground">Warranty</dt>
                  <dd className="text-xs font-medium">
                    {product.warrantyMonths ? `${product.warrantyMonths} months` : "None"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Compare with</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Product</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">Rating</th>
                    <th className="py-3 pr-4 font-medium">Warranty</th>
                    <th className="py-3 pr-4 font-medium">Delivery</th>
                    <th className="py-3 font-medium">AI score</th>
                  </tr>
                </thead>
                <tbody>
                  {[product, ...related].map((p) => (
                    <tr key={p.id} className="border-b border-border">
                      <td className="py-3 pr-4">
                        <Link
                          to="/product/$productId"
                          params={{ productId: p.id }}
                          className="font-medium hover:text-primary"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">{ugx(p.retail)}</td>
                      <td className="py-3 pr-4">{p.rating}</td>
                      <td className="py-3 pr-4">{p.warrantyMonths || "—"} mo</td>
                      <td className="py-3 pr-4">{p.deliveryDays}d</td>
                      <td className="py-3 font-semibold text-primary">{p.aiScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}