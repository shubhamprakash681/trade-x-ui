"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useToast } from "@/components/atoms/toast";
import { authApi } from "@/api/auth.api";
import { AxiosError } from "axios";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
  }>({});

  function validateEmail(): boolean {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateReset(): boolean {
    const newErrors: typeof errors = {};
    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (otp.trim().length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await authApi.requestPasswordRecovery({ email: email.trim().toLowerCase() });
      toast("success", "OTP sent", "Check your email for the 6-digit code");
      setStep("reset");
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message || "Failed to send OTP";
        toast("error", "Error", msg);
      } else {
        toast("error", "Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!validateReset()) return;

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });
      toast("success", "Password reset!", "You can now sign in with your new password");
      router.push("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message || "Failed to reset password";
        toast("error", "Error", msg);
      } else {
        toast("error", "Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border-primary bg-bg-secondary">
      <CardContent>
        {/* Progress indicator */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              1
            </div>
            <span className="text-xs font-medium text-text-primary">Email</span>
          </div>
          <div className="h-px flex-1 bg-border-primary" />
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === "reset"
                  ? "bg-brand text-white"
                  : "bg-bg-tertiary text-text-tertiary"
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-medium ${
                step === "reset" ? "text-text-primary" : "text-text-tertiary"
              }`}
            >
              Reset
            </span>
          </div>
        </div>

        {step === "email" ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-text-primary">
                Forgot password?
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Enter your email and we&apos;ll send you a reset code
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
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

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send reset code
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-text-primary">
                Reset your password
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-text-primary">{email}</span>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              <Input
                label="OTP Code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  // Only allow digits, max 6
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                  if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                }}
                error={errors.otp}
                icon={<KeyRound className="h-4 w-4" />}
                inputMode="numeric"
                maxLength={6}
                autoFocus
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                error={errors.newPassword}
                icon={<Lock className="h-4 w-4" />}
                autoComplete="new-password"
              />

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Reset password
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setNewPassword("");
                  setErrors({});
                }}
                className="flex w-full items-center justify-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Use a different email
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-text-secondary">
          Remember your password?{" "}
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
