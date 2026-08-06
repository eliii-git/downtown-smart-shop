"use client";
import { useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Store, Plus, BarChart3, Package, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/dashboard")({
  component: VendorDashboard,
});

function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
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

  if (!isAuthenticated || !user || user.role !== "vendor") {
    return null;
  }

  const stats = [
    { label: "Total Products", value: "24", icon: Package, href: "/market" },
    { label: "Orders This Week", value: "12", icon: BarChart3, href: "/market" },
    { label: "Revenue (UGX)", value: "2.4M", icon: BarChart3, href: "/market" },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, {user.name}</p>
          {user.businessName && (
            <p className="mt-1 text-sm text-muted-foreground">{user.businessName} · {user.shopLocation}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Shop Settings
              </Button>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <div className="mt-4 space-y-3">
              {[
                { id: "ORD-001", customer: "John D.", amount: "UGX 45,000", status: "Pending" },
                { id: "ORD-002", customer: "Sarah M.", amount: "UGX 120,000", status: "Processing" },
                { id: "ORD-003", customer: "Mike K.", amount: "UGX 85,000", status: "Delivered" },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
