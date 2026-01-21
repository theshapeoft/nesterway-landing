"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthCard,
  FormField,
  PasswordInput,
  SubmitButton,
  AlertMessage,
} from "@/components/auth";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (errorParam === "auth_callback_error") {
      setError("There was a problem signing you in. Please try again.");
    }
  }, [errorParam]);

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
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

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (
          signInError.message.includes("Invalid login credentials") ||
          signInError.message.includes("invalid")
        ) {
          setError("Invalid email or password. Please try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}`
          );
          return;
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Successful login - redirect
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to manage your properties."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertMessage type="error" message={error} />}

        <FormField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          error={fieldErrors.email}
          disabled={isLoading}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          error={fieldErrors.password}
          disabled={isLoading}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground">
              Remember me for 30 days
            </span>
          </label>
        </div>

        <SubmitButton isLoading={isLoading} loadingText="Logging in...">
          Log In
        </SubmitButton>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthCard
          title="Welcome back"
          description="Log in to manage your properties."
        >
          <div className="py-8 text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </AuthCard>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
