"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const STORAGE_KEY = "dt_signup_draft";

const roleOptions = [
  { value: "customer" as UserRole, label: "Customer", description: "Buy products from shops" },
  {
    value: "vendor" as UserRole,
    label: "Vendor / Shop Owner",
    description: "Sell products on DownTown",
  },
  {
    value: "transport" as UserRole,
    label: "Transport Facilitator",
    description: "Deliver goods (Farasi, Safeboda)",
  },
];

const transportCompanies = [
  { value: "Farasi", label: "Farasi" },
  { value: "Safeboda", label: "Safeboda" },
];

export const Route = createFileRoute("/auth/signup")({
  component: SignUp,
});

function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);
  const shopRef = useRef<HTMLInputElement>(null);
  const transportCompanyRef = useRef<HTMLSelectElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.name && nameRef.current) nameRef.current.value = draft.name;
      if (draft.phone && phoneRef.current) phoneRef.current.value = draft.phone;
      if (draft.email && emailRef.current) emailRef.current.value = draft.email;
      if (draft.password && passwordRef.current) passwordRef.current.value = draft.password;
      if (draft.confirmPassword && confirmRef.current)
        confirmRef.current.value = draft.confirmPassword;
      if (draft.businessName && businessRef.current) businessRef.current.value = draft.businessName;
      if (draft.shopLocation && shopRef.current) shopRef.current.value = draft.shopLocation;
      if (draft.transportCompany && transportCompanyRef.current)
        transportCompanyRef.current.value = draft.transportCompany;
      if (draft.licenseNumber && licenseRef.current) licenseRef.current.value = draft.licenseNumber;
      if (draft.role) setRole(draft.role);
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const persist = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name: nameRef.current?.value,
          phone: phoneRef.current?.value,
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
          confirmPassword: confirmRef.current?.value,
          businessName: businessRef.current?.value,
          shopLocation: shopRef.current?.value,
          transportCompany: transportCompanyRef.current?.value,
          licenseNumber: licenseRef.current?.value,
          role,
        }),
      );
    } catch {
      // ignore localStorage errors
    }
  };

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
      const transportCompanyValue = transportCompanyRef.current?.value ?? "";
      const licenseValue = licenseRef.current?.value?.trim() ?? "";

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
          transportCompany: transportCompanyValue || undefined,
          licenseNumber: licenseValue || undefined,
        });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem("dt_auth_token", result.token);
        setTimeout(() => {
          window.location.href = getDashboardPath(result.user.role);
        }, 50);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Signup failed");
        setLoading(false);
      }
    },
    [role],
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
                  <Input ref={nameRef} id="signup-name" required onChange={persist} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    ref={phoneRef}
                    id="signup-phone"
                    type="tel"
                    placeholder="+256 700 000000"
                    required
                    onChange={persist}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input ref={emailRef} id="signup-email" type="email" required onChange={persist} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      ref={passwordRef}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      onChange={persist}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      ref={confirmRef}
                      id="signup-confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      onChange={persist}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-role">I am a...</Label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  persist();
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your role</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {role === "vendor" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Shop Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="vendor-business">Shop / Business Name</Label>
                  <Input ref={businessRef} id="vendor-business" required onChange={persist} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor-location">Shop Location (e.g., Kikubo Stall 24)</Label>
                  <Input ref={shopRef} id="vendor-location" required onChange={persist} />
                </div>
              </div>
            )}

            {role === "transport" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <h4 className="text-sm font-semibold">Transport Details</h4>
                <div className="space-y-2">
                  <Label htmlFor="transport-company">Transport Company</Label>
                  <select
                    id="transport-company"
                    ref={transportCompanyRef}
                    required
                    onChange={persist}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select company</option>
                    {transportCompanies.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transport-license">License / Registration Number</Label>
                  <Input ref={licenseRef} id="transport-license" required onChange={persist} />
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
