import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { AuthNav } from "@/components/auth/AuthNav";
import brandIcon from "@/assets/brand-icon.svg";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={brandIcon}
            alt="DownTown UG"
            className="h-9 w-9 shrink-0 rounded-xl"
          />
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
