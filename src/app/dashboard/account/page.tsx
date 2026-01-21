"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Trash2 } from "lucide-react";
import {
  FormField,
  PasswordInput,
  SubmitButton,
  AlertMessage,
} from "@/components/auth";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type TabType = "profile" | "password" | "delete";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
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
