import { createFileRoute, notFound } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Star, Users } from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { ProductCard } from "@/components/site/ProductCard";
import { TrustScore } from "@/components/site/TrustScore";
import { getShop, products } from "@/data/marketplace";

export const Route = createFileRoute("/shop/$shopId")({
  loader: ({ params }) => {
    const shop = getShop(params.shopId);
    if (!shop) throw notFound();
    return { shop };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.shop.name ?? "Shop";
    const desc = loaderData?.shop.about ?? "A verified shop on DownTown Uganda.";
    return {
      meta: [
        { title: `${name} | DownTown Uganda` },
        { name: "description", content: desc },
        { property: "og:title", content: name },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ShopPage,
});

function ShopPage() {
  const { shop } = Route.useLoaderData();
  const items = products.filter((p) => p.shopId === shop.id);

  const factors = [
    ["Verified status", shop.verified ? "Verified" : "Pending"],
    ["Customer rating", `${shop.rating} / 5`],
    ["Years on platform", `${shop.years}`],
    ["Completed sales", shop.completedSales.toLocaleString()],
    ["Response speed", `~${shop.responseMins} min`],
    ["Fraud reports", "0"],
  ];

  return (
    <Shell>
      <div
        className="h-44 w-full sm:h-56"
        style={{ backgroundImage: "var(--gradient-gold)" }}
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="surface-card -mt-14 p-6">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              {shop.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{shop.name}</h1>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {shop.location}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <TrustScore score={shop.trustScore} size="lg" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {shop.rating}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
              <Users className="h-3.5 w-3.5" />
              {shop.followers.toLocaleString()} followers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
              <Clock className="h-3.5 w-3.5" />
              {shop.hours}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{shop.about}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              Follow shop
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold">How this Trust Score is built</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map(([k, v]) => (
              <div key={k} className="surface-card flex items-center justify-between gap-3 p-4">
                <span className="min-w-0 truncate text-sm text-muted-foreground">{k}</span>
                <span className="shrink-0 text-sm font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">Products ({items.length})</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}