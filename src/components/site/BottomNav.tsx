import { Link } from "@tanstack/react-router";
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Play,
  Sparkles,
  Store,
  User,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const publicItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/market", label: "Market", Icon: Store },
  { to: "/assistant", label: "Ask AI", Icon: Sparkles },
  { to: "/videos", label: "Videos", Icon: Play },
] as const;

const customerItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/market", label: "Market", Icon: Store },
  { to: "/cart", label: "Cart", Icon: ShoppingCart },
  { to: "/assistant", label: "Ask AI", Icon: Sparkles },
  { to: "/videos", label: "Videos", Icon: Play },
] as const;

const vendorItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/vendor/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/vendor/messages", label: "Messages", Icon: MessageSquare },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

const transportItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/transport/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/vendor/messages", label: "Messages", Icon: MessageSquare },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const { user, isAuthenticated } = useAuth();

  const items = !isAuthenticated
    ? publicItems
    : user?.role === "vendor"
      ? vendorItems
      : user?.role === "transport"
        ? transportItems
        : customerItems;

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-50 border-t border-border/70 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl grid-cols-5">
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
      </div>
    </nav>
  );
}
