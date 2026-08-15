"use client";
import { useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/vendor/dashboard")({
  component: VendorDashboard,
});

const weeklyChartData = [
  { day: "Mon", sales: 12 },
  { day: "Tue", sales: 18 },
  { day: "Wed", sales: 8 },
  { day: "Thu", sales: 22 },
  { day: "Fri", sales: 30 },
  { day: "Sat", sales: 45 },
  { day: "Sun", sales: 28 },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John D.",
    amount: "UGX 45,000",
    status: "Pending",
    date: "2 min ago",
  },
  {
    id: "ORD-002",
    customer: "Sarah M.",
    amount: "UGX 120,000",
    status: "Processing",
    date: "15 min ago",
  },
  {
    id: "ORD-003",
    customer: "Mike K.",
    amount: "UGX 85,000",
    status: "Delivered",
    date: "1 hour ago",
  },
  {
    id: "ORD-004",
    customer: "Grace N.",
    amount: "UGX 210,000",
    status: "Delivered",
    date: "3 hours ago",
  },
  {
    id: "ORD-005",
    customer: "David O.",
    amount: "UGX 32,000",
    status: "Pending",
    date: "5 hours ago",
  },
];

function VendorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

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
    { label: "Total Products", value: "24", icon: Package, change: "+3 this week", up: true },
    { label: "Total Orders", value: "156", icon: BarChart3, change: "+12% vs last week", up: true },
    { label: "Pending Orders", value: "8", icon: Clock, change: "Action needed", up: false },
    { label: "Revenue (UGX)", value: "4.2M", icon: DollarSign, change: "+18.5%", up: true },
  ];

  const quickActions = [
    { to: "/vendor/add-product", label: "Add Product", icon: Plus, description: "List a new item" },
    { to: "/vendor/revenue", label: "Revenue", icon: TrendingUp, description: "View analytics" },
    { to: "/vendor/videos", label: "Videos", icon: Video, description: "Manage promos" },
    {
      to: "/vendor/messages",
      label: "Messages",
      icon: MessageSquare,
      description: "Customer chat",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Processing":
        return "secondary";
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const totalSales = weeklyChartData.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Vendor Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user.businessName
                    ? `${user.businessName} · ${user.shopLocation}`
                    : `Welcome back, ${user.name}`}
                </p>
              </div>
            </div>
          </div>
          <Link to="/vendor/add-product">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  {stat.up ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                  <p className={`mt-1 text-xs ${stat.up ? "text-green-600" : "text-orange-500"}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 surface-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Weekly Performance</h2>
                <p className="text-sm text-muted-foreground">
                  Total sales this week: {totalSales} units
                </p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                +24%
              </Badge>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyChartData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              {quickActions.map((action) => (
                <Link key={action.to} to={action.to}>
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mr-3">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                </Link>
              ))}
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mr-3">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Shop Settings</p>
                  <p className="text-xs text-muted-foreground">Manage profile</p>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 surface-card overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Latest transactions from your shop</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.customer}</td>
                    <td className="px-6 py-4 font-medium">{order.amount}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
