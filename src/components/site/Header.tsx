import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthNav } from "@/components/auth/AuthNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
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

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
