"use client";

import { useRef, useState } from "react";
import { FormField } from "@/components/auth/FormField";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
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

  return (
    <form ref={formRef} onChange={handleChange} className="space-y-6">
      {/* Hidden inputs for image URLs */}
      <input type="hidden" name="host_photo_url" value={hostPhotoUrl || ""} />
      <input type="hidden" name="hero_image_url" value={heroImageUrl || ""} />
      <FormField
        label="Property Name"
        name="name"
        type="text"
        defaultValue={property.name}
        required
      />

      <div className="space-y-2">
        <label
          htmlFor="welcome_message"
          className="block text-sm font-medium text-foreground"
        >
          Welcome Message
        </label>
        <textarea
          id="welcome_message"
          name="welcome_message"
          defaultValue={property.welcome_message || ""}
          placeholder="Welcome to our home! We're thrilled to have you stay with us..."
          rows={4}
          maxLength={500}
          className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          A personal welcome for your guests
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
    </form>
  );
}
