"use client";
import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Truck, MapPin, Clock, DollarSign, Navigation, Package, Star, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getOrders, getTransporters, type Order, type TransporterProfile } from "@/lib/cart";
import { RouteMap } from "@/components/site/RouteMap";

export const Route = createFileRoute("/transport/dashboard")({
  component: TransportDashboard,
});

function TransportDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "transport")) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading, user?.role]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

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

  const myOrders = orders.filter((o) => o.transporterId === user.id || o.status === "pending");
  const activeOrders = myOrders.filter((o) => o.status === "assigned" || o.status === "in_transit");
  const completedOrders = myOrders.filter((o) => o.status === "delivered");

  const earningsToday = activeOrders.reduce((acc, o) => acc + o.deliveryCost, 0);

  const transporters = getTransporters();
  const me = transporters.find((t) => t.id === user.id);

  const shopLat = me?.lat || 0.3476;
  const shopLng = me?.lng || 32.5825;
  const customerLat = selectedOrder
    ? shopLat + (selectedOrder.id.charCodeAt(4) % 100) / 1000
    : shopLat + 0.02;
  const customerLng = selectedOrder
    ? shopLng + (selectedOrder.id.charCodeAt(5) % 100) / 1000
    : shopLng + 0.02;

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
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Deliveries</p>
                  <p className="mt-1 text-2xl font-bold">{activeOrders.length}</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Earnings</p>
                  <p className="mt-1 text-2xl font-bold">{`UGX ${earningsToday.toLocaleString()}`}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="mt-1 text-2xl font-bold">{completedOrders.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="mt-1 text-2xl font-bold">{me?.rating.toFixed(1) || "4.5"}</p>
                </div>
                <Star className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                {myOrders.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No deliveries assigned yet. Go online to receive orders.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          selectedOrder?.id === order.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.shopName} → Customer
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={order.status === "in_transit" ? "default" : "secondary"}
                            >
                              {order.status.replace("_", " ")}
                            </Badge>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {order.distanceKm ? `${order.distanceKm.toFixed(1)} km` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>Route Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <RouteMap
                    shopLat={shopLat}
                    shopLng={shopLng}
                    customerLat={customerLat}
                    customerLng={customerLng}
                    transporterLat={me?.lat}
                    transporterLng={me?.lng}
                    className="rounded-lg border border-border"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">DISTANCE</p>
                      <p className="font-medium">
                        {selectedOrder.distanceKm?.toFixed(1) || "—"} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ETA</p>
                      <p className="font-medium">{selectedOrder.etaMinutes || "—"} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">PAYMENT</p>
                      <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">EARNINGS</p>
                      <p className="font-medium">{`UGX ${selectedOrder.deliveryCost.toLocaleString()}`}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button className="w-full justify-start" variant="outline">
                  <Navigation className="mr-2 h-4 w-4" />
                  Go Online
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="mr-2 h-4 w-4" />
                  Update Location
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{user.transportCompany || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">License</p>
                  <p className="font-medium">{user.licenseNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deliveries</p>
                  <p className="font-medium">{me?.deliveries || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
