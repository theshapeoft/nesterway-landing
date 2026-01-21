"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Trash2, Link2 } from "lucide-react";
import {
  FormField,
  PasswordInput,
  SubmitButton,
  AlertMessage,
} from "@/components/auth";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type TabType = "profile" | "connections" | "password" | "delete";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "connections" as const, label: "Connections", icon: Link2 },
    { id: "password" as const, label: "Password", icon: Lock },
    { id: "delete" as const, label: "Delete", icon: Trash2 },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          Account Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-border bg-card p-6">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "connections" && <ConnectionsTab />}
        {activeTab === "password" && <PasswordTab />}
        {activeTab === "delete" && <DeleteTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFormData({
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: formData.name },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">
        Profile Information
      </h2>

      {error && <AlertMessage type="error" message={error} />}
      {success && (
        <AlertMessage type="success" message="Profile updated successfully!" />
      )}

      <FormField
        label="Full Name"
        type="text"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        disabled={isLoading}
      />

      <div className="space-y-2">
        <FormField
          label="Email Address"
          type="email"
          value={formData.email}
          disabled
          hint="Contact support to change your email address."
        />
      </div>

      <SubmitButton isLoading={isLoading} loadingText="Saving...">
        Save Changes
      </SubmitButton>
    </form>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ConnectionsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [googleIdentity, setGoogleIdentity] = useState<{
    provider: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    const loadIdentities = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.identities) {
        const google = user.identities.find((i) => i.provider === "google");
        if (google) {
          setGoogleIdentity({
            provider: google.provider,
            email: google.identity_data?.email as string | undefined,
          });
        }
      }
    };
    loadIdentities();
  }, []);

  const handleConnectGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: linkError } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/account`,
        },
      });

      if (linkError) {
        setError(linkError.message);
        setIsLoading(false);
      }
      // If successful, user will be redirected to Google
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.identities) {
        setError("Unable to load account identities.");
        return;
      }

      const googleIdentityData = user.identities.find(
        (i) => i.provider === "google"
      );

      if (!googleIdentityData) {
        setError("Google account is not connected.");
        return;
      }

      // Check if this is the only identity
      if (user.identities.length === 1) {
        setError(
          "Cannot disconnect Google. You must have at least one login method. Set a password first."
        );
        return;
      }

      const { error: unlinkError } = await supabase.auth.unlinkIdentity(
        googleIdentityData
      );

      if (unlinkError) {
        setError(unlinkError.message);
        return;
      }

      setGoogleIdentity(null);
      setSuccess("Google account disconnected successfully.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-foreground">
          Connected Accounts
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Link your social accounts for easier sign-in.
        </p>
      </div>

      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <GoogleIcon />
            </div>
            <div>
              <p className="font-medium text-foreground">Google</p>
              {googleIdentity ? (
                <p className="text-sm text-muted-foreground">
                  Connected as {googleIdentity.email || "Google account"}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>

          {googleIdentity ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnectGoogle}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Disconnect"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleConnectGoogle}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Connect"}
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        You can use connected accounts to sign in to Travelama. Make sure you
        have at least one login method available.
      </p>
    </div>
  );
}

function PasswordTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Change Password</h2>

      {error && <AlertMessage type="error" message={error} />}
      {success && (
        <AlertMessage
          type="success"
          message="Password updated successfully!"
        />
      )}

      <PasswordInput
        label="New Password"
        showStrength
        value={formData.newPassword}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
        }
        error={fieldErrors.newPassword}
        disabled={isLoading}
        autoComplete="new-password"
      />

      <PasswordInput
        label="Confirm New Password"
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
        Update Password
      </SubmitButton>
    </form>
  );
}

function DeleteTab() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");

  const handleDelete = async () => {
    if (confirmation !== "DELETE") return;

    setIsLoading(true);
    setError(null);

    try {
      // Note: Full account deletion requires a server-side API route
      // For now, we'll just sign out
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/?deleted=true");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-foreground">Delete Account</h2>

      <AlertMessage
        type="warning"
        message="This action cannot be undone. All your data will be permanently deleted."
      />

      {error && <AlertMessage type="error" message={error} />}

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Deleting your account will:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Remove all your properties</li>
          <li>Deactivate all QR codes</li>
          <li>Delete your personal data</li>
        </ul>
      </div>

      <hr className="border-border" />

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To confirm deletion, type <strong>DELETE</strong> below:
        </p>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
        />
        <Button
          variant="default"
          onClick={handleDelete}
          disabled={confirmation !== "DELETE" || isLoading}
          className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isLoading ? "Deleting..." : "Delete My Account"}
        </Button>
      </div>
    </div>
  );
}
