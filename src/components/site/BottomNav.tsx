import { Link } from "@tanstack/react-router";
import { Home, Play, Sparkles, Store, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/market", label: "Market", Icon: Store },
  { to: "/assistant", label: "Ask AI", Icon: Sparkles },
  { to: "/videos", label: "Videos", Icon: Play },
] as const;

export function BottomNav() {
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/70 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={label}
            to={to}
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "text-primary" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
        <button
          type="button"
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
        >
          <User className="h-5 w-5" />
          Account
        </button>
      </div>
    </nav>
  );
}