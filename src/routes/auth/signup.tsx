"use client";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { signup } from "@/lib/auth";
import { type UserRole } from "@/lib/auth-schema";

export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
});

const roleOptions = [
  { value: "customer" as UserRole, label: "Customer", description: "Buy products from shops" },
  { value: "vendor" as UserRole, label: "Vendor / Shop Owner", description: "Sell products on DownTown" },
  { value: "transport" as UserRole, label: "Transport Facilitator", description: "Deliver goods (Safeboda, Farasi)" },
];

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "" as UserRole | "",
    businessName: "",
    shopLocation: "",
    transportCompany: "",
    vehicleType: "",
    licenseNumber: "",
    defaultAddress: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role as UserRole,
        businessName: formData.businessName || undefined,
        shopLocation: formData.shopLocation || undefined,
        transportCompany: formData.transportCompany || undefined,
        vehicleType: formData.vehicleType || undefined,
        licenseNumber: formData.licenseNumber || undefined,
        defaultAddress: formData.defaultAddress || undefined,
      });
      localStorage.setItem("dt_auth_token", result.token);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = formData.role as UserRole | "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join DownTown Uganda as a vendor, transport facilitator, or customer
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary">Account Information</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+256 700 000000" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <Select value={selectedRole} onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <p className="font-medium">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole === "vendor" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Shop Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Shop / Business Name</Label>
                  <Input id="businessName" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopLocation">Shop Location (e.g., Kikubo Stall 24)</Label>
                  <Input id="shopLocation" value={formData.shopLocation} onChange={(e) => updateField("shopLocation", e.target.value)} required />
                </div>
              </div>
            )}

            {selectedRole === "transport" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Transport Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="transportCompany">Company</Label>
                  <Select value={formData.transportCompany} onValueChange={(value) => updateField("transportCompany", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safeboda">Safeboda</SelectItem>
                      <SelectItem value="farasi">Farasi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => updateField("vehicleType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boda-boda">Boda Boda</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License / Registration Number</Label>
                  <Input id="licenseNumber" value={formData.licenseNumber} onChange={(e) => updateField("licenseNumber", e.target.value)} required />
                </div>
              </div>
            )}

            {selectedRole === "customer" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Delivery Information</h4>
                <div className="space-y-2">
                  <Label htmlFor="defaultAddress">Default Delivery Address</Label>
                  <Input id="defaultAddress" placeholder="e.g., Nakawa, Kampala" value={formData.defaultAddress} onChange={(e) => updateField("defaultAddress", e.target.value)} required />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/auth/signin">Sign in</a>
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
