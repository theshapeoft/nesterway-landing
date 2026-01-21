/**
 * Centralized Email Service using Resend
 *
 * ALL emails in this application MUST go through this service.
 * Do not use Supabase's built-in email functionality.
 *
 * @see CLAUDE.md for the email rule
 */

import { Resend } from "resend";
import { renderBrandedEmail, type BrandedEmailOptions } from "./templates";

// Re-export types and template utilities
export { renderBrandedEmail, type BrandedEmailOptions } from "./templates";

type EmailTag = { name: string; value: string };

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY environment variable is not set. Email sending is disabled."
      );
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

function getFromAddress(): string {
  const from = process.env.RESEND_FROM;
  if (!from) {
    throw new Error(
      "RESEND_FROM environment variable is not set (e.g., 'Travelama <hello@travelama.com>')"
    );
  }
  return from;
}

function buildTags(category: string, extra: EmailTag[] = []): EmailTag[] {
  const env = process.env.NODE_ENV || "development";
  return [
    { name: "category", value: category },
    { name: "env", value: env },
    ...extra,
  ];
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  category: string;
  tags?: EmailTag[];
  replyTo?: string;
}

export interface SendBrandedEmailOptions {
  to: string | string[];
  subject: string;
  category: string;
  template: BrandedEmailOptions;
  replyTo?: string;
}

/**
 * Send a raw email with custom HTML
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  category,
  tags = [],
  replyTo,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || stripHtml(html),
      tags: buildTags(category, tags),
      replyTo,
    });

    if (error) {
      console.error("[Email] Send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Email] Send error:", message);
    return { success: false, error: message };
  }
}

/**
 * Send a branded email using the Travelama template
 */
export async function sendBrandedEmail({
  to,
  subject,
  category,
  template,
  replyTo,
}: SendBrandedEmailOptions): Promise<{ success: boolean; error?: string }> {
  const html = renderBrandedEmail(template);

  return sendEmail({
    to,
    subject,
    html,
    category,
    replyTo,
  });
}

// ============================================
// Pre-built email templates for common use cases
// ============================================

/**
 * Send email confirmation link
 */
export async function sendConfirmationEmail(
  email: string,
  confirmationLink: string
): Promise<{ success: boolean; error?: string }> {
  return sendBrandedEmail({
    to: email,
    subject: "Confirm your Travelama account",
    category: "auth-confirmation",
    template: {
      heading: "Welcome to Travelama!",
      paragraphs: [
        "Thanks for signing up. Please confirm your email address to get started.",
        "Click the button below to verify your account:",
      ],
      button: {
        label: "Confirm Email",
        url: confirmationLink,
      },
      signature: "The Travelama Team",
    },
  });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<{ success: boolean; error?: string }> {
  return sendBrandedEmail({
    to: email,
    subject: "Reset your Travelama password",
    category: "auth-password-reset",
    template: {
      heading: "Reset Your Password",
      paragraphs: [
        "We received a request to reset your password.",
        "Click the button below to choose a new password. This link expires in 1 hour.",
      ],
      button: {
        label: "Reset Password",
        url: resetLink,
      },
      signature: "The Travelama Team",
    },
  });
}

/**
 * Send magic link for passwordless login
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<{ success: boolean; error?: string }> {
  return sendBrandedEmail({
    to: email,
    subject: "Your Travelama login link",
    category: "auth-magic-link",
    template: {
      heading: "Log in to Travelama",
      paragraphs: [
        "Click the button below to log in to your account.",
        "This link expires in 1 hour and can only be used once.",
      ],
      button: {
        label: "Log In",
        url: magicLink,
      },
      signature: "The Travelama Team",
    },
  });
}

// Helper to strip HTML for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
