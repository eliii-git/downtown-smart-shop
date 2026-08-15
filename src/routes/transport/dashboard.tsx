"use client";
import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Truck, MapPin, Clock, DollarSign, Navigation } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/transport/dashboard")({
  component: TransportDashboard,
});

function TransportDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "transport")) {
      navigate({ to: "/auth/signin", replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

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

  if (!isAuthenticated || !user || user.role !== "transport") {
    return null;
  }

  const stats = [
    { label: "Deliveries Today", value: "8", icon: Navigation },
    { label: "Active Deliveries", value: "3", icon: Truck },
    { label: "Earnings (UGX)", value: "156K", icon: DollarSign },
    { label: "Avg. Time", value: "42 min", icon: Clock },
  ];

  const deliveries = [
    { id: "DEL-101", from: "Kikubo", to: "Nakawa", status: "In Transit", earnings: "UGX 15,000" },
    { id: "DEL-102", from: "Owino", to: "Mbarara", status: "Pending", earnings: "UGX 45,000" },
    { id: "DEL-103", from: "Kikubo", to: "Jinja", status: "Delivered", earnings: "UGX 25,000" },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transport Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, {user.name}</p>
          {user.transportCompany && (
            <p className="mt-1 text-sm text-muted-foreground">
              {user.transportCompany} · {user.licenseNumber}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card hover-lift p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Available Deliveries</h2>
            <div className="mt-4 space-y-3">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{delivery.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {delivery.from} → {delivery.to}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{delivery.earnings}</p>
                    <p className="text-xs text-muted-foreground">{delivery.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Button className="w-full justify-start" variant="outline">
                <Navigation className="mr-2 h-4 w-4" />
                Go Online
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Update Location
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
