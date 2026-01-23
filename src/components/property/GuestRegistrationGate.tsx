"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Property } from "@/types";

interface GuestRegistrationGateProps {
  property: Property;
  onRegistrationComplete: () => void;
}

// Storage key for guest registration
const getStorageKey = (propertyId: string) => `travelama_guest_registered_${propertyId}`;

// Check if guest is already registered (cookie persists for 30 days)
export function isGuestRegistered(propertyId: string): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem(getStorageKey(propertyId));
  if (!stored) return false;

  try {
    const { expiresAt } = JSON.parse(stored);
    if (new Date(expiresAt) > new Date()) {
      return true;
    }
    // Expired, remove it
    localStorage.removeItem(getStorageKey(propertyId));
    return false;
  } catch {
    return false;
  }
}

// Mark guest as registered with 30-day expiration
function markAsRegistered(propertyId: string): void {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  localStorage.setItem(
    getStorageKey(propertyId),
    JSON.stringify({ expiresAt: expiresAt.toISOString() })
  );
}

export function GuestRegistrationGate({
  property,
  onRegistrationComplete,
}: GuestRegistrationGateProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [additionalGuests, setAdditionalGuests] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Track view event
  useEffect(() => {
    track("guest_registration_viewed", {
      property_id: property.id,
      property_slug: property.slug,
    });
  }, [property.id, property.slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit registration to API
      const response = await fetch("/api/guest-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          additionalGuests,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      // Mark as registered in localStorage
      markAsRegistered(property.id);

      // Track success
      track("guest_registered", {
        property_id: property.id,
        property_slug: property.slug,
        additional_guests: additionalGuests,
      });

      setSuccess(true);

      // After a brief success message, allow access
      setTimeout(() => {
        onRegistrationComplete();
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary";

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
          <p className="mt-2 text-muted-foreground">
            Taking you to the property guide...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-center text-lg font-semibold text-foreground">
            {property.name}
          </h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 p-4">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Quick Registration
            </h2>
            <p className="mt-2 text-muted-foreground">
              Please share your details to access the property guide.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="full-name"
                className="block text-sm font-medium text-foreground"
              >
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                placeholder="John Smith"
                required
                autoFocus
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="john@example.com"
                required
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="additional-guests"
                className="block text-sm font-medium text-foreground"
              >
                Number of Additional Guests{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="additional-guests"
                type="number"
                min="0"
                max="20"
                value={additionalGuests}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAdditionalGuests(parseInt(e.target.value, 10) || 0)
                }
                placeholder="0"
                className={inputClassName}
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Continue to Guide"}
            </Button>
          </form>

          {/* Privacy Notice */}
          <p className="text-center text-xs text-muted-foreground">
            By registering, you agree to our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . Your information will be shared with the property host and stored
            securely for 30 days.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
        Powered by{" "}
        <a
          href="https://travelama.com"
          className="text-primary hover:underline"
        >
          Travelama
        </a>
      </footer>
    </div>
  );
}
