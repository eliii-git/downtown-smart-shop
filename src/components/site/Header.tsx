import { Link } from "@tanstack/react-router";
import { Bell, Heart, Menu, ShoppingBag, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/market", label: "Marketplace" },
  { to: "/videos", label: "Videos" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/shop/$shopId", label: "Shops", params: { shopId: "kikubo-electronics" } },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
          </span>
          <span className="font-display truncate text-base font-bold tracking-tight">
            DownTown <span className="text-muted-foreground">UG</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            "params" in item ? (
              <Link
                key={item.label}
                to={item.to}
                params={item.params}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            to="/assistant"
            className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Link>
          <button
            type="button"
            aria-label="Wishlist"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}