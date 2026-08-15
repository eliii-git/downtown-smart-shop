"use client";
import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShoppingBag, Heart, MapPin, Clock, Star, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getOrders, type Order } from "@/lib/cart";

export const Route = createFileRoute("/customer/dashboard")({
  component: CustomerDashboard,
});

function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "customer")) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading, user?.role]);

  useEffect(() => {
    const all = getOrders();
    setOrders(all.filter((o) => o.userId === user?.id));
  }, [user?.id]);

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
    { label: "Orders", value: String(orders.length), icon: ShoppingBag, href: "/market" },
    { label: "Wishlist", value: "0", icon: Heart, href: "/market" },
    {
      label: "Deliveries",
      value: String(orders.filter((o) => o.status === "in_transit").length),
      icon: MapPin,
      href: "/market",
    },
    { label: "Reviews", value: "0", icon: Star, href: "/market" },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "in_transit":
        return "secondary";
      case "assigned":
        return "outline";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

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
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.shopName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{`UGX ${order.grandTotal.toLocaleString()}`}</p>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status.replace("_", " ")}
                      </Badge>
                      {order.transporterName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Truck className="h-3 w-3" />
                          {order.transporterName}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
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
              <Link to="/cart">
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
              </Link>
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
