"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import {
  AuthCard,
  PasswordInput,
  SubmitButton,
  AlertMessage,
} from "@/components/auth";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    // Check if we have the necessary auth params
    const code = searchParams.get("code");
    if (!code) {
      // No code means the link might be expired or invalid
      setIsExpired(true);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) {
        if (updateError.message.includes("expired")) {
          setIsExpired(true);
        } else {
          setError(updateError.message);
        }
        return;
      }

      setSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isExpired) {
    return (
      <AuthCard title="Link expired">
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              This password reset link has expired or is invalid.
            </p>
            <p className="text-sm text-muted-foreground">
              Please request a new one.
            </p>
          </div>

          <Link href="/forgot-password">
            <SubmitButton type="button">Request New Link</SubmitButton>
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard title="Password updated!">
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              Your password has been successfully reset.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to the dashboard...
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create new password"
      description="Enter a new password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertMessage type="error" message={error} />}

        <PasswordInput
          label="New Password"
          placeholder="Create a strong password"
          required
          showStrength
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          error={fieldErrors.password}
          disabled={isLoading}
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          error={fieldErrors.confirmPassword}
          disabled={isLoading}
          autoComplete="new-password"
        />

        <SubmitButton isLoading={isLoading} loadingText="Updating...">
          Reset Password
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthCard
          title="Create new password"
          description="Enter a new password for your account."
        >
          <div className="py-8 text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </AuthCard>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
