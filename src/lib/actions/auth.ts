"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendConfirmationEmail, sendPasswordResetEmail } from "@/lib/email";

// Admin client for generating auth links
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY for admin operations"
    );
  }

  return createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export interface SignupResult {
  success: boolean;
  error?: string;
  requiresConfirmation?: boolean;
}

/**
 * Sign up a new user and send confirmation email via Resend
 */
export async function signupWithEmail(
  email: string,
  password: string,
  fullName: string,
  redirectTo: string
): Promise<SignupResult> {
  try {
    const supabase = await createClient();

    // Create the user (Supabase won't send email since enable_confirmations = false)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: redirectTo,
        },
      }
    );

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        return {
          success: false,
          error: "This email is already registered. Try logging in instead.",
        };
      }
      return { success: false, error: signUpError.message };
    }

    // Check if user already exists and is confirmed
    if (signUpData.user?.identities?.length === 0) {
      return {
        success: false,
        error: "This email is already registered. Try logging in instead.",
      };
    }

    // Generate confirmation link using admin API
    const adminClient = getAdminClient();
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "signup",
        email,
        password,
        options: {
          redirectTo,
          data: {
            full_name: fullName,
          },
        },
      });

    if (linkError) {
      console.error("[Auth] Failed to generate confirmation link:", linkError);
      // User is created but we couldn't generate link - they can use resend
      return {
        success: true,
        requiresConfirmation: true,
        error: "Account created but confirmation email failed. Please use resend.",
      };
    }

    // Send confirmation email via Resend
    const emailResult = await sendConfirmationEmail(
      email,
      linkData.properties.action_link
    );

    if (!emailResult.success) {
      console.error("[Auth] Failed to send confirmation email:", emailResult.error);
      return {
        success: true,
        requiresConfirmation: true,
        error: "Account created but confirmation email failed. Please use resend.",
      };
    }

    return { success: true, requiresConfirmation: true };
  } catch (err) {
    console.error("[Auth] Signup error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Resend confirmation email via Resend
 * Uses magiclink type since user already exists but isn't confirmed
 */
export async function resendConfirmationEmail(
  email: string,
  redirectTo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = getAdminClient();

    // For existing unconfirmed users, use magiclink to confirm and log them in
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo,
        },
      });

    if (linkError) {
      // User might not exist
      if (linkError.message.includes("User not found")) {
        return { success: false, error: "No account found with this email." };
      }
      console.error("[Auth] Failed to generate confirmation link:", linkError);
      return { success: false, error: "Failed to resend confirmation email." };
    }

    // Send via Resend
    const emailResult = await sendConfirmationEmail(
      email,
      linkData.properties.action_link
    );

    if (!emailResult.success) {
      return { success: false, error: "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("[Auth] Resend confirmation error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Send password reset email via Resend
 */
export async function sendPasswordReset(
  email: string,
  redirectTo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = getAdminClient();

    // Generate password reset link
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo,
        },
      });

    if (linkError) {
      // Don't reveal if user exists or not
      console.error("[Auth] Failed to generate reset link:", linkError);
      // Return success anyway to prevent email enumeration
      return { success: true };
    }

    // Send via Resend
    await sendPasswordResetEmail(email, linkData.properties.action_link);

    return { success: true };
  } catch (err) {
    console.error("[Auth] Password reset error:", err);
    // Return success to prevent email enumeration
    return { success: true };
  }
}
