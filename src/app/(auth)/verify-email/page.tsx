"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthCard, SubmitButton, AlertMessage } from "@/components/auth";
import { resendConfirmationEmail } from "@/lib/actions/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const result = await resendConfirmationEmail(email, redirectTo);

      if (!result.success) {
        setError(result.error || "Failed to resend email");
      } else {
        setResendSuccess(true);
      }
    } catch {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard title="Check your email">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground">
            We sent a verification link to:
          </p>
          <p className="font-semibold text-foreground">{email}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account.
        </p>

        <hr className="border-border" />

        {error && <AlertMessage type="error" message={error} />}
        {resendSuccess && (
          <AlertMessage type="success" message="Verification email sent!" />
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it?
          </p>
          <SubmitButton
            type="button"
            onClick={handleResend}
            isLoading={isResending}
            loadingText="Sending..."
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Resend Email
          </SubmitButton>
        </div>

        <p className="text-xs text-muted-foreground">
          Check your spam folder or try a different email address.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to signup
        </Link>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Check your email">
          <div className="text-center py-8">
            <div className="animate-pulse">Loading...</div>
          </div>
        </AuthCard>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
