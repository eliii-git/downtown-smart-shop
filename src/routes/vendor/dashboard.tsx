"use client";
import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Store,
  Plus,
  BarChart3,
  Package,
  Settings,
  DollarSign,
  Video,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Truck,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/vendor/dashboard")({
  component: VendorDashboard,
});

const weeklyRevenue = [
  { day: "Mon", revenue: 450000, orders: 12 },
  { day: "Tue", revenue: 380000, orders: 9 },
  { day: "Wed", revenue: 520000, orders: 15 },
  { day: "Thu", revenue: 610000, orders: 18 },
  { day: "Fri", revenue: 890000, orders: 24 },
  { day: "Sat", revenue: 1200000, orders: 32 },
  { day: "Sun", revenue: 750000, orders: 21 },
];

const recentOrders = [
  { id: "ORD-001", customer: "John D.", items: 3, amount: "UGX 45,000", status: "Pending", date: "2 min ago" },
  { id: "ORD-002", customer: "Sarah M.", items: 1, amount: "UGX 120,000", status: "Processing", date: "15 min ago" },
  { id: "ORD-003", customer: "Mike K.", items: 2, amount: "UGX 85,000", status: "Delivered", date: "1 hour ago" },
  { id: "ORD-004", customer: "Aisha N.", items: 5, amount: "UGX 210,000", status: "In Transit", date: "3 hours ago" },
  { id: "ORD-005", customer: "Ronald S.", items: 1, amount: "UGX 35,000", status: "Pending", date: "5 hours ago" },
];

const topProducts = [
  { name: "Samsung Galaxy A35", sales: 45, revenue: "UGX 2,250,000" },
  { name: "Hisense 43\" Smart TV", sales: 28, revenue: "UGX 1,120,000" },
  { name: "Wireless ANC Headphones", sales: 19, revenue: "UGX 380,000" },
];

function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading, user?.role]);

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
    { label: "Total Products", value: "24", change: "+3", up: true, icon: Package },
    { label: "Orders This Week", value: "12", change: "+8.2%", up: true, icon: ShoppingBag },
    { label: "Revenue (UGX)", value: "2.4M", change: "+12.5%", up: true, icon: DollarSign },
    { label: "Pending Orders", value: "3", change: "-2", up: false, icon: Truck },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Processing":
      case "In Transit":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-bold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              {user.businessName?.charAt(0) ?? user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.businessName || "My Shop"}</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name} · {user.shopLocation}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/vendor/add-product">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="surface-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    <div className={`mt-1 flex items-center gap-1 text-xs ${stat.up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change} from last period
                    </div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <div className="flex gap-2">
                {["week", "month"].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range as "week" | "month")}
                    className="capitalize"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`UGX ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link to="/vendor/add-product">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
              <Link to="/vendor/revenue">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Revenue Monitoring
                </Button>
              </Link>
              <Link to="/vendor/videos">
                <Button className="w-full justify-start" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Manage Videos
                </Button>
              </Link>
              <Link to="/vendor/messages">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Shop Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Order ID</th>
                      <th className="pb-3 pr-4 font-medium">Customer</th>
                      <th className="pb-3 pr-4 font-medium">Items</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 pr-4 font-mono text-xs font-medium">{order.id}</td>
                        <td className="py-3 pr-4">{order.customer}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{order.items}</td>
                        <td className="py-3 pr-4 font-medium">{order.amount}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={product.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
