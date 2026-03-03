"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/thread");
      } else {
        const data = await res.json();
        setError(data.error ?? "Registration failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-warm">
      <Card className="w-full max-w-sm bg-card border-border shadow-meditation">
        <CardHeader>
          <CardTitle className="font-serif text-primary text-center text-2xl">
            Thread of Selves
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground font-serif">
            begin your record
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-serif text-foreground/80">
                Username{" "}
                <span className="text-muted-foreground">(min 3 characters)</span>
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="font-serif"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-serif text-foreground/80">
                Password{" "}
                <span className="text-muted-foreground">(min 8 characters)</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="font-serif"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-serif">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
            >
              {loading ? "Creating account…" : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-serif">
              Already have an account?{" "}
              <a
                href="/login"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
