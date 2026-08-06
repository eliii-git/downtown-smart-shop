"use client";
import { useRef, useCallback, useState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signup, getDashboardPath } from "@/lib/auth";
import { type UserRole } from "@/lib/auth-schema";

export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
});

const roleOptions = [
  { value: "customer" as UserRole, label: "Customer", description: "Buy products from shops" },
  { value: "vendor" as UserRole, label: "Vendor / Shop Owner", description: "Sell products on DownTown" },
  { value: "transport" as UserRole, label: "Transport Facilitator", description: "Deliver goods (Safeboda, Farasi)" },
];

const transportCompanies = [
  { value: "safeboda", label: "Safeboda" },
  { value: "farasi", label: "Farasi" },
  { value: "other", label: "Other" },
];

const vehicleTypes = [
  { value: "boda-boda", label: "Boda Boda" },
  { value: "truck", label: "Truck" },
  { value: "pickup", label: "Pickup" },
];

function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole | "">("");

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const shopRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const vehicleRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      const nameValue = nameRef.current?.value?.trim() ?? "";
      const phoneValue = phoneRef.current?.value?.trim() ?? "";
      const emailValue = emailRef.current?.value?.trim() ?? "";
      const passwordValue = passwordRef.current?.value ?? "";
      const confirmValue = confirmRef.current?.value ?? "";
      const businessValue = businessRef.current?.value?.trim() ?? "";
      const shopValue = shopRef.current?.value?.trim() ?? "";
      const companyValue = companyRef.current?.value?.trim() ?? "";
      const vehicleValue = vehicleRef.current?.value?.trim() ?? "";
      const licenseValue = licenseRef.current?.value?.trim() ?? "";
      const addressValue = addressRef.current?.value?.trim() ?? "";

      if (!role) {
        setError("Please select your role");
        return;
      }
      if (passwordValue !== confirmValue) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      try {
        const result = await signup({
          email: emailValue,
          password: passwordValue,
          name: nameValue,
          phone: phoneValue,
          role: role as UserRole,
          businessName: businessValue || undefined,
          shopLocation: shopValue || undefined,
          transportCompany: companyValue || undefined,
          vehicleType: vehicleValue || undefined,
          licenseNumber: licenseValue || undefined,
          defaultAddress: addressValue || undefined,
        });
        localStorage.setItem("dt_auth_token", result.token);
        setTimeout(() => {
          window.location.href = getDashboardPath(result.user.role);
        }, 50);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Signup failed");
        setLoading(false);
      }
    },
    [role]
  );

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
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input ref={nameRef} id="signup-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input ref={phoneRef} id="signup-phone" type="tel" placeholder="+256 700 000000" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input ref={emailRef} id="signup-email" type="email" required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input ref={passwordRef} id="signup-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input ref={confirmRef} id="signup-confirm" type="password" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-role">I am a...</Label>
              <Select value={role || undefined} onValueChange={(value) => {
                setRole(value as UserRole);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <p className="font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === "vendor" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Shop Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="vendor-business">Shop / Business Name</Label>
                  <Input ref={businessRef} id="vendor-business" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-location">Shop Location (e.g., Kikubo Stall 24)</Label>
                  <Input ref={shopRef} id="vendor-location" required />
                </div>
              </div>
            )}

            {role === "transport" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Transport Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="transport-company">Company</Label>
                  <Select value={companyRef.current?.value || undefined} onValueChange={(value) => {
                    if (companyRef.current) companyRef.current.value = value;
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportCompanies.map((company) => (
                        <SelectItem key={company.value} value={company.value}>
                          {company.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transport-vehicle">Vehicle Type</Label>
                  <Select value={vehicleRef.current?.value || undefined} onValueChange={(value) => {
                    if (vehicleRef.current) vehicleRef.current.value = value;
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transport-license">License / Registration Number</Label>
                  <Input ref={licenseRef} id="transport-license" required />
                </div>
              </div>
            )}

            {role === "customer" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Delivery Information</h4>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Default Delivery Address</Label>
                  <Input ref={addressRef} id="customer-address" placeholder="e.g., Nakawa, Kampala" required />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading || !role}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  window.location.href = "/auth/signin";
                }}
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
