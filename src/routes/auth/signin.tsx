"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, LogIn } from "lucide-react";
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
import { login, getDashboardPath } from "@/lib/auth";

const STORAGE_KEY = "dt_signin_draft";

export const Route = createFileRoute("/auth/signin")({
  component: SignIn,
});

function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (emailRef.current && draft.email) emailRef.current.value = draft.email;
      if (passwordRef.current && draft.password) passwordRef.current.value = draft.password;
    } catch {}
  }, []);

  const persist = (email?: string, password?: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    } catch {}
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const emailValue = emailRef.current?.value?.trim() ?? "";
      const passwordValue = passwordRef.current?.value ?? "";

      if (!emailValue || !passwordValue) {
        setError("Please enter both email and password");
        return;
      }

      setError("");
      setLoading(true);
      try {
        const result = await login({ email: emailValue, password: passwordValue });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem("dt_auth_token", result.token);
        setTimeout(() => {
          window.location.href = getDashboardPath(result.user.role);
        }, 50);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your DownTown account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                ref={emailRef}
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => persist(e.target.value, passwordRef.current?.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                ref={passwordRef}
                id="signin-password"
                type="password"
                required
                onChange={(e) => persist(emailRef.current?.value, e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => {
                  window.location.href = "/auth/signup";
                }}
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
