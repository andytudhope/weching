"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/thread");
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
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
            sign in to your record
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-serif text-foreground/80">
                Username
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
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
              {loading ? "Signing in…" : "Sign In"}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-serif">
              New here?{" "}
              <a
                href="/register"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Create an account
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
