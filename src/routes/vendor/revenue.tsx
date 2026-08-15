"use client";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Truck } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/vendor/revenue")({
  component: RevenueMonitoring,
});

const dailyData = [
  { day: "Mon", revenue: 450000, orders: 12 },
  { day: "Tue", revenue: 380000, orders: 9 },
  { day: "Wed", revenue: 520000, orders: 15 },
  { day: "Thu", revenue: 610000, orders: 18 },
  { day: "Fri", revenue: 890000, orders: 24 },
  { day: "Sat", revenue: 1200000, orders: 32 },
  { day: "Sun", revenue: 750000, orders: 21 },
];

const weeklyData = [
  { day: "W1", revenue: 2400000, orders: 65 },
  { day: "W2", revenue: 2800000, orders: 78 },
  { day: "W3", revenue: 3200000, orders: 89 },
  { day: "W4", revenue: 4100000, orders: 112 },
];

const monthlyData = [
  { day: "Jan", revenue: 8500000, orders: 210 },
  { day: "Feb", revenue: 9200000, orders: 245 },
  { day: "Mar", revenue: 10500000, orders: 280 },
  { day: "Apr", revenue: 12300000, orders: 320 },
];

function RevenueMonitoring() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");

  const chartData = timeRange === "day" ? dailyData : timeRange === "week" ? weeklyData : monthlyData;
  const chartLabel = timeRange === "day" ? "day" : timeRange === "week" ? "week" : "month";

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      navigate({ to: "/auth/signin", replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "vendor") {
    return null;
  }

  const stats = [
    { label: "Total Revenue", value: "UGX 4.1M", change: "+12.5%", up: true, icon: DollarSign },
    { label: "Total Orders", value: "131", change: "+8.2%", up: true, icon: ShoppingBag },
    { label: "Avg. Order Value", value: "UGX 31,300", change: "+4.1%", up: true, icon: TrendingUp },
    { label: "Delivery Revenue", value: "UGX 156K", change: "-2.3%", up: false, icon: Truck },
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/vendor/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Revenue Monitoring</h1>
              <p className="text-sm text-muted-foreground">Track your sales and earnings</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    <div className={`mt-1 flex items-center gap-1 text-xs ${stat.up ? "text-green-600" : "text-red-600"}`}>
                      {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change} from last period
                    </div>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
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
              <CardTitle>Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`UGX ${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Samsung Galaxy A54", sales: 45, revenue: "UGX 2,250,000" },
                { name: "Nike Air Max", sales: 32, revenue: "UGX 1,280,000" },
                { name: "Sony Headphones", sales: 28, revenue: "UGX 840,000" },
                { name: "Kitchen Gas Stove", sales: 19, revenue: "UGX 570,000" },
              ].map((product, i) => (
                <div key={product.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
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
    </Shell>
  );
}
