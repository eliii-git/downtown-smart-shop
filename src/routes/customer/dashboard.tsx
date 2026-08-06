"use client";
import { useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShoppingBag, Heart, MapPin, Clock, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/customer/dashboard")({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "customer")) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "customer") {
    return null;
  }

  const stats = [
    { label: "Orders", value: "5", icon: ShoppingBag, href: "/market" },
    { label: "Wishlist", value: "12", icon: Heart, href: "/market" },
    { label: "Deliveries", value: "3", icon: MapPin, href: "/market" },
    { label: "Reviews", value: "8", icon: Star, href: "/market" },
  ];

  const orders = [
    { id: "ORD-501", shop: "Kikubo Electronics", amount: "UGX 120,000", status: "Delivered", date: "2 days ago" },
    { id: "ORD-502", shop: "Fabric World", amount: "UGX 45,000", status: "In Transit", date: "Today" },
    { id: "ORD-503", shop: "Kitchen Hub", amount: "UGX 89,000", status: "Processing", date: "Today" },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, {user.name}</p>
          {user.defaultAddress && (
            <p className="mt-1 text-sm text-muted-foreground">Delivering to: {user.defaultAddress}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.href} className="surface-card hover-lift p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.shop}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Link to="/market">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Track Delivery
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Heart className="mr-2 h-4 w-4" />
                View Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
