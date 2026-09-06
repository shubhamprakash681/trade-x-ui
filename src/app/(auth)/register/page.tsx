"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/components/atoms/toast";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    } else if (fullName.trim().length > 120) {
      newErrors.fullName = "Name must be less than 120 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (password.length > 80) {
      newErrors.password = "Password must be less than 80 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authApi.signup({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast("success", "Account created!", `Welcome to TradeX, ${data.user.fullName}`);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        if (status === 409) {
          toast("error", "Registration failed", "Email is already registered");
        } else {
          toast("error", "Registration failed", msg || "An unexpected error occurred");
        }
      } else {
        toast("error", "Registration failed", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border-primary bg-bg-secondary">
      <CardContent>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-text-primary">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Start paper trading with TradeX
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            error={errors.fullName}
            icon={<User className="h-4 w-4" />}
            autoComplete="name"
            autoFocus
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            error={errors.email}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
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
            autoComplete="new-password"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand hover:text-brand-hover transition-colors"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
