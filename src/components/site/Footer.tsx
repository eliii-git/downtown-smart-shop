import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

const columns = [
  { title: "Marketplace", links: ["Browse products", "Wholesale deals", "Verified shops", "Compare"] },
  { title: "For business", links: ["Open a shop", "Seller analytics", "Advertising", "Trust Score"] },
  { title: "Delivery", links: ["Ride with us", "Rider earnings", "Coverage areas", "Track an order"] },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
              </span>
              <span className="font-display text-base font-bold">DownTown Uganda</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              An intelligent commerce layer for East Africa — starting in Kikubo, Uganda's largest
              wholesale market.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DownTown Uganda. Kampala, Uganda.</p>
          <p>Privacy · Terms · Seller policy</p>
        </div>
      </div>
    </footer>
  );
}