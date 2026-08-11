"use client";
import { useEffect } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, User, Mail, Phone, MapPin, Store, Truck, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("dt_auth_token");
    logout();
    window.location.href = "/";
  };

  const roleConfig = {
    vendor: {
      icon: Store,
      color: "bg-blue-500/10 text-blue-600",
      label: "Vendor / Shop Owner",
      extraFields: [
        { label: "Business Name", value: user.businessName },
        { label: "Shop Location", value: user.shopLocation },
      ],
    },
    transport: {
      icon: Truck,
      color: "bg-green-500/10 text-green-600",
      label: "Transport Facilitator",
      extraFields: [
        { label: "Company", value: user.transportCompany },
        { label: "Vehicle Type", value: user.vehicleType },
        { label: "License Number", value: user.licenseNumber },
      ],
    },
    customer: {
      icon: User,
      color: "bg-purple-500/10 text-purple-600",
      label: "Customer",
      extraFields: [
        { label: "Default Address", value: user.defaultAddress },
      ],
    },
  };

  const config = roleConfig[user.role];
  const RoleIcon = config.icon;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`grid h-16 w-16 place-items-center rounded-full ${config.color}`}>
                  <RoleIcon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">{config.label}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
              </div>

              {config.extraFields.map((field) => (
                <div key={field.label} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{field.value || "Not set"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={user.role === "vendor" ? "/vendor/dashboard" : user.role === "transport" ? "/transport/dashboard" : "/customer/dashboard"}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
