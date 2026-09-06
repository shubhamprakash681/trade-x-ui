"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/components/atoms/toast";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast("success", "Welcome back!", `Logged in as ${data.user.fullName}`);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message || "Invalid email or password";
        toast("error", "Login failed", msg);
      } else {
        toast("error", "Login failed", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border-primary bg-bg-secondary">
      <CardContent>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to your TradeX account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            autoFocus
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            icon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-text-primary transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-brand hover:text-brand-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand hover:text-brand-hover transition-colors"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
