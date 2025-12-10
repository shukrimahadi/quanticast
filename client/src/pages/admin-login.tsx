import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const ADMIN_TOKEN_KEY = "admin_session_token";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    // Simple placeholder auth. Replace with real admin auth backend.
    localStorage.setItem(ADMIN_TOKEN_KEY, btoa(`${email}:${Date.now()}`));
    setLocation("/admin/console");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-4 border border-border bg-card/80">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-fin-accent text-white flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin Module</p>
            <h1 className="text-xl font-semibold">Secure Login</h1>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && <p className="text-sm text-fin-bear">{error}</p>}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}

