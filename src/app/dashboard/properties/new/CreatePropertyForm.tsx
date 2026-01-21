"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { LocationInput, LocationData, TemplateSelector } from "@/components/dashboard";
import { Loader2 } from "lucide-react";

interface CreatePropertyFormProps {
  createProperty: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function CreatePropertyForm({ createProperty }: CreatePropertyFormProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [templateId, setTemplateId] = useState<string | null>("blank");

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      // Append location data to form
      if (location) {
        formData.set("address", location.address);
        formData.set("city", location.city);
        formData.set("country", location.country);
        formData.set("latitude", location.latitude.toString());
        formData.set("longitude", location.longitude.toString());
        formData.set("place_id", location.placeId);
      }
      // Append template selection
      if (templateId) {
        formData.set("template_id", templateId);
      }
      const result = await createProperty(formData);
      return result ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormField
        label="Property Name"
        name="name"
        type="text"
        placeholder="e.g., Beachside Villa"
        required
        disabled={isPending}
        error={state?.error}
      />

      <LocationInput
        label="Property Address"
        value={location}
        onChange={setLocation}
        disabled={isPending}
        hint="Search for your property's full address"
      />

      <TemplateSelector
        value={templateId}
        onChange={setTemplateId}
        disabled={isPending}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          disabled={isPending}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" variant="accent" className="flex-1" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Property"
          )}
        </Button>
      </div>
    </form>
  );
}
