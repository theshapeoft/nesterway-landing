"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import type { Property } from "@/types";

interface AccessRestrictedProps {
  property: Property;
  onAccessGranted?: () => void;
}

const ACCESS_CODE_STORAGE_KEY = "travelama_access_codes";

// Store validated access code in localStorage with 30-day expiry
function storeAccessCode(propertyId: string, accessCode: string) {
  try {
    const existing = localStorage.getItem(ACCESS_CODE_STORAGE_KEY);
    const codes = existing ? JSON.parse(existing) : {};
    codes[propertyId] = {
      code: accessCode,
      validatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(ACCESS_CODE_STORAGE_KEY, JSON.stringify(codes));
  } catch {
    // localStorage might be unavailable
  }
}

// Check if there's a previously validated access code
export function getStoredAccessCode(propertyId: string): string | null {
  try {
    const existing = localStorage.getItem(ACCESS_CODE_STORAGE_KEY);
    if (!existing) return null;
    const codes = JSON.parse(existing);
    const stored = codes[propertyId];
    if (!stored) return null;
    // Check if expired
    if (new Date(stored.expiresAt) < new Date()) {
      // Clean up expired code
      delete codes[propertyId];
      localStorage.setItem(ACCESS_CODE_STORAGE_KEY, JSON.stringify(codes));
      return null;
    }
    return stored.code;
  } catch {
    return null;
  }
}

export function AccessRestricted({ property, onAccessGranted }: AccessRestrictedProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  const handleAccessCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccessCodeError(null);

    const trimmedCode = accessCode.trim();
    if (!trimmedCode) {
      setAccessCodeError("Please enter an access code");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("/api/validate-access-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          accessCode: trimmedCode,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Store the validated access code
        storeAccessCode(property.id, trimmedCode.toUpperCase());
        // Grant access
        onAccessGranted?.();
      } else {
        setAccessCodeError(data.error || "Invalid access code. Please check and try again.");
      }
    } catch {
      setAccessCodeError("Unable to validate access code. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContactError(null);

    // Client-side validation
    if (!contactName.trim()) {
      setContactError("Please enter your name");
      setIsSubmitting(false);
      return;
    }

    if (!contactEmail.trim()) {
      setContactError("Please enter your email");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          guestName: contactName.trim(),
          guestEmail: contactEmail.trim(),
          message: contactMessage.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setContactError(data.error || "Failed to send request. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setContactSubmitted(true);
    } catch {
      setContactError("Unable to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary";

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
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Access Restricted
            </h2>
            <p className="mt-2 text-muted-foreground">
              This guide is invite-only. Enter your access code or contact the
              host for access.
            </p>
          </div>

          {/* Access Code Form */}
          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="access-code"
                className="block text-sm font-medium text-foreground"
              >
                Access Code
              </label>
              <div className="flex gap-2">
                <input
                  id="access-code"
                  type="text"
                  value={accessCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAccessCode(e.target.value.toUpperCase());
                    setAccessCodeError(null);
                  }}
                  placeholder="Enter 8-character code"
                  maxLength={8}
                  className={`${inputClassName} font-mono uppercase tracking-widest`}
                />
                <Button type="submit" variant="accent" disabled={isValidating}>
                  {isValidating ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {accessCodeError && (
                <p className="text-sm text-destructive">{accessCodeError}</p>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Contact Host Section */}
          {!showContactForm && !contactSubmitted && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowContactForm(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Host for Access
            </Button>
          )}

          {/* Contact Form */}
          {showContactForm && !contactSubmitted && (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-foreground"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContactName(e.target.value)
                  }
                  placeholder="John Smith"
                  required
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-foreground"
                >
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContactEmail(e.target.value)
                  }
                  placeholder="john@example.com"
                  required
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-foreground"
                >
                  Message{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="contact-message"
                  value={contactMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContactMessage(e.target.value)
                  }
                  placeholder="I'd like to request access to view your property guide..."
                  rows={3}
                  maxLength={500}
                  className={`${inputClassName} resize-none`}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {contactMessage.length}/500
                </p>
              </div>

              {contactError && (
                <p className="text-sm text-destructive">{contactError}</p>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowContactForm(false);
                    setContactError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          )}

          {/* Success Message */}
          {contactSubmitted && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
              <h3 className="mt-2 font-medium text-green-900">Request Sent</h3>
              <p className="mt-1 text-sm text-green-700">
                The host will contact you directly if they approve your request.
              </p>
            </div>
          )}
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
