"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthCard,
  FormField,
  PasswordInput,
  SubmitButton,
  AlertMessage,
} from "@/components/auth";
import { signupWithEmail } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
      const redirectTo = `${window.location.origin}/auth/callback`;

      const result = await signupWithEmail(
        formData.email,
        formData.password,
        formData.name,
        redirectTo
      );

      if (!result.success) {
        setError(result.error || "Failed to create account");
        return;
      }

      // Redirect to verification pending page
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      description="Join Travelama and create digital manuals for your rental properties."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertMessage type="error" message={error} />}

        <FormField
          label="Full Name"
          type="text"
          placeholder="e.g., Maria Santos"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          error={fieldErrors.name}
          disabled={isLoading}
          autoComplete="name"
        />

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

        <SubmitButton isLoading={isLoading} loadingText="Creating account...">
          Create Account
        </SubmitButton>

        <p className="text-xs text-center text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
