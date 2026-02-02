"use client";

import { useRef, useState, useCallback } from "react";
import { Globe, Lock, UserCheck } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { RichTextEditor, plainTextToHtml } from "@/components/editor";
import type { DbProperty } from "@/lib/actions/properties";

interface BasicInfoTabProps {
  property: DbProperty;
  onSave: (formData: FormData) => void;
}

export function BasicInfoTab({ property, onSave }: BasicInfoTabProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [hostPhotoUrl, setHostPhotoUrl] = useState<string | null>(
    property.host_photo_url || null
  );
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(
    property.hero_image_url || null
  );
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    // Convert plain text to HTML if needed for backwards compatibility
    plainTextToHtml(property.welcome_message || "")
  );
  const [accessMode, setAccessMode] = useState<"public" | "invite_only">(
    property.access_mode || "public"
  );
  const [requireGuestRegistration, setRequireGuestRegistration] = useState<boolean>(
    property.require_guest_registration || false
  );

  const handleChange = () => {
    // Debounce auto-save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        onSave(formData);
      }
    }, 500);
  };

  const triggerSave = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      onSave(formData);
    }
  };

  const handleHostPhotoUpload = (url: string) => {
    setHostPhotoUrl(url);
    // Trigger save after state update
    setTimeout(triggerSave, 0);
  };

  const handleHostPhotoRemove = () => {
    setHostPhotoUrl(null);
    setTimeout(triggerSave, 0);
  };

  const handleHeroImageUpload = (url: string) => {
    setHeroImageUrl(url);
    setTimeout(triggerSave, 0);
  };

  const handleHeroImageRemove = () => {
    setHeroImageUrl(null);
    setTimeout(triggerSave, 0);
  };

  const handleWelcomeMessageChange = useCallback((html: string) => {
    setWelcomeMessage(html);
    // Debounce auto-save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        onSave(formData);
      }
    }, 500);
  }, [onSave]);

  const handleAccessModeChange = (mode: "public" | "invite_only") => {
    setAccessMode(mode);
    // Trigger save immediately
    setTimeout(triggerSave, 0);
  };

  const handleRequireRegistrationChange = (value: boolean) => {
    setRequireGuestRegistration(value);
    // Trigger save immediately
    setTimeout(triggerSave, 0);
  };

  return (
    <form ref={formRef} onChange={handleChange} className="space-y-6">
      {/* Hidden inputs for image URLs, welcome message, and access mode */}
      <input type="hidden" name="host_photo_url" value={hostPhotoUrl || ""} />
      <input type="hidden" name="hero_image_url" value={heroImageUrl || ""} />
      <input type="hidden" name="welcome_message" value={welcomeMessage || ""} />
      <input type="hidden" name="access_mode" value={accessMode} />
      <input type="hidden" name="require_guest_registration" value={requireGuestRegistration.toString()} />
      <FormField
        label="Property Name"
        name="name"
        type="text"
        defaultValue={property.name}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Welcome Message
        </label>
        <RichTextEditor
          content={welcomeMessage}
          onChange={handleWelcomeMessageChange}
          maxLength={500}
          placeholder="Welcome to our home! We're thrilled to have you stay with us..."
        />
        <p className="text-xs text-muted-foreground">
          A personal welcome for your guests. Use formatting to highlight important info.
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 font-medium text-foreground">Host Details</h3>

        <FormField
          label="Your Name"
          name="host_display_name"
          type="text"
          defaultValue={property.host_display_name || ""}
          placeholder="e.g., Maria"
          hint="The name guests will see"
        />

        <div className="mt-4">
          <ImageUpload
            bucket="host-photos"
            folder="profile"
            currentUrl={hostPhotoUrl}
            onUpload={handleHostPhotoUpload}
            onRemove={handleHostPhotoRemove}
            circular
            resizeToSize={200}
            previewSize="sm"
            label="Your Photo"
            hint="A friendly photo helps guests feel welcome"
          />
        </div>

        <div className="mt-4">
          <FormField
            label="WhatsApp Number"
            name="host_whatsapp"
            type="tel"
            defaultValue={property.host_whatsapp || ""}
            placeholder="+1 555 123 4567"
            hint="Include country code. Guests can tap to message you directly."
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 font-medium text-foreground">Property Image</h3>

        <ImageUpload
          bucket="property-images"
          folder="hero"
          currentUrl={heroImageUrl}
          onUpload={handleHeroImageUpload}
          onRemove={handleHeroImageRemove}
          aspectRatio="video"
          label="Hero Image"
          hint="The main image shown at the top of your property guide"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 font-medium text-foreground">Check-out</h3>

        <div className="space-y-2">
          <label
            htmlFor="checkout_time"
            className="block text-sm font-medium text-foreground"
          >
            Check-out Time
          </label>
          <input
            id="checkout_time"
            name="checkout_time"
            type="time"
            defaultValue={property.checkout_time || "11:00"}
            className="w-32 rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 font-medium text-foreground">Access Control</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Control who can view your property guide.
        </p>

        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              accessMode === "public"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name="access_mode_radio"
              value="public"
              checked={accessMode === "public"}
              onChange={() => handleAccessModeChange("public")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="font-medium">Public</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Anyone with the link or QR code can view your guide.
              </p>
            </div>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              accessMode === "invite_only"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="radio"
              name="access_mode_radio"
              value="invite_only"
              checked={accessMode === "invite_only"}
              onChange={() => handleAccessModeChange("invite_only")}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="font-medium">Invite-Only</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Only guests with an access code can view your guide.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 font-medium text-foreground">Guest Registration</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Collect guest contact information before they view your guide.
        </p>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
            requireGuestRegistration
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input
            type="checkbox"
            checked={requireGuestRegistration}
            onChange={(e) => handleRequireRegistrationChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Require Guest Registration</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Guests must provide their name and email before viewing your guide.
              This allows you to collect contact info for newsletters, updates, or remarketing.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Registration is stored for 30 days. Guest data is handled in compliance with privacy laws.
            </p>
          </div>
        </label>
      </div>
    </form>
  );
}
