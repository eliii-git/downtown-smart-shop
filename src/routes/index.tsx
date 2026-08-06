"use client";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CookingPot,
  Hammer,
  Headphones,
  Laptop,
  MapPin,
  Play,
  Shirt,
  Smartphone,
  Sparkles,
  Sprout,
  Star,
  Truck,
} from "lucide-react";
import heroImg from "@/assets/hero-market.jpg";
import { Shell } from "@/components/site/Shell";
import { AISearchBar } from "@/components/site/AISearchBar";
import { ProductCard } from "@/components/site/ProductCard";
import { TrustScore } from "@/components/site/TrustScore";
import { categories, faqs, products, shops, testimonials, videoFeed } from "@/data/marketplace";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDashboardPath } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DownTown Uganda — AI-Powered Wholesale Marketplace" },
      {
        name: "description",
        content:
          "Compare Kikubo wholesale prices, ask the AI shopping assistant, buy from verified shops and get same-day delivery across Uganda.",
      },
      { property: "og:title", content: "DownTown Uganda — AI-Powered Wholesale Marketplace" },
      {
        property: "og:description",
        content:
          "An intelligent commerce layer for East Africa. AI recommendations, trust scores, video discovery and delivery — starting in Kikubo.",
      },
    ],
  }),
  component: Index,
});

const iconMap: Record<string, typeof Smartphone> = {
  Smartphone,
  Shirt,
  CookingPot,
  Laptop,
  Headphones,
  Hammer,
  Sparkles,
  Sprout,
};

function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.id) {
      navigate({ to: getDashboardPath(user.role) });
    }
  }, [isAuthenticated, isLoading, user?.id]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Traders and a delivery rider in Uganda's Kikubo wholesale market at golden hour"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" />
            Now live in Kikubo, Kampala
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Buy smarter in Uganda's{" "}
            <span className="text-gradient-gold">biggest wholesale market</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ask in plain language. Our AI compares price, quality, warranty, delivery and seller
            trust across Kikubo — then tells you what to actually buy.
          </p>

          <div className="mt-8 max-w-2xl">
            <AISearchBar />
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["4,800+", "Products listed"],
              ["320", "Verified shops"],
              ["48 min", "Median delivery"],
              ["94%", "Avg. trust score"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold sm:text-3xl">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Browse" title="Featured categories" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] ?? Sparkles;
            return (
              <Link
                key={c.name}
                to="/market"
                className="surface-card hover-lift flex flex-col items-center gap-2.5 p-4 text-center"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold leading-tight">{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{c.count.toLocaleString()}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <SectionHead
          eyebrow="Hot right now"
          title="Trending products"
          action={
            <Link to="/market" className="text-sm font-medium text-primary hover:underline">
              See all
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHead
          eyebrow="Discover"
          title="Trending videos"
          action={
            <Link to="/videos" className="text-sm font-medium text-primary hover:underline">
              Open feed
            </Link>
          }
        />
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {videoFeed.map((v) => (
            <Link
              key={v.id}
              to="/videos"
              className="hover-lift relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-2xl border border-border sm:w-52"
              style={{
                backgroundImage: `linear-gradient(160deg, oklch(0.6 0.15 ${v.hue}), oklch(0.24 0.05 ${v.hue}))`,
              }}
            >
              <span className="glass absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full">
                <Play className="h-4 w-4 fill-current" />
              </span>
              <div
                className="absolute inset-x-0 bottom-0 p-3"
                style={{ backgroundImage: "var(--gradient-ink)" }}
              >
                <p className="line-clamp-3 text-xs font-medium text-white">{v.caption}</p>
                <p className="mt-2 text-[11px] text-white/70">
                  {v.likes.toLocaleString()} likes · {v.comments} comments
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified shops */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <SectionHead eyebrow="Trust" title="Verified shops" />
        <div className="grid gap-4 md:grid-cols-3">
          {shops.map((s) => (
            <Link
              key={s.id}
              to="/shop/$shopId"
              params={{ shopId: s.id }}
              className="surface-card hover-lift p-5"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-display text-lg font-bold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  {s.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{s.location}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <TrustScore score={s.trustScore} />
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {s.rating}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  {s.years} yrs
                </span>
              </div>
              <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {s.about}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top deals */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Save more" title="Top bulk deals" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(2, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Delivery band */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div
          className="surface-card overflow-hidden p-8 sm:p-12"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 text-xs font-medium">
                <Truck className="h-3.5 w-3.5" /> Delivery
              </span>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                From the stall to your shop, tracked the whole way
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Request a rider at checkout, watch live tracking, get an honest ETA, and confirm with
                proof of delivery. Consolidated upcountry runs leave twice daily.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Live tracking", "Rider location every 10 seconds"],
                ["Proof of delivery", "Photo + signature on drop-off"],
                ["Scheduled runs", "Pick a delivery window"],
                ["Consolidation", "One rider, many stalls"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Traders" title="What the market says" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="surface-card p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <SectionHead eyebrow="Questions" title="Frequently asked" />
        <Accordion type="single" collapsible className="surface-card px-5">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border">
              <AccordionTrigger className="text-left text-sm font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Shell>
  );
}
