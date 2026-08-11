import { Link } from "@tanstack/react-router";
import { Bell, Menu, ShoppingBag, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthNav } from "@/components/auth/AuthNav";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const { user } = useAuth();

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
          {!user && (
            <>
              <Link
                to="/market"
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link
                to="/videos"
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Videos
              </Link>
              <Link
                to="/assistant"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                AI Assistant
              </Link>
              <Link
                to="/shop/$shopId"
                params={{ shopId: "kikubo-electronics" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Shops
              </Link>
            </>
          )}
          {user?.role === "vendor" && (
            <Link
              to="/vendor/dashboard"
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "transport" && (
            <Link
              to="/transport/dashboard"
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {user?.role === "customer" && (
            <>
              <Link
                to="/market"
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Marketplace
              </Link>
              <Link
                to="/videos"
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Videos
              </Link>
              <Link
                to="/assistant"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                AI Assistant
              </Link>
            </>
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!user && (
            <Link
              to="/assistant"
              className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 sm:inline-flex"
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </Link>
          )}
          <button
            type="button"
            aria-label="Wishlist"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
          >
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <AuthNav />
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
