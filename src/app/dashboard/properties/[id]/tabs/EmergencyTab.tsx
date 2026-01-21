"use client";

import { useState, useEffect, useTransition } from "react";
import { Phone, Mail, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { createClient } from "@/lib/supabase/client";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

interface EmergencyTabProps {
  propertyId: string;
  onDataChange?: () => void;
}

export function EmergencyTab({ propertyId, onDataChange }: EmergencyTabProps) {
  const [contact, setContact] = useState<EmergencyContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchContact();
  }, [propertyId]);

  const fetchContact = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("property_id", propertyId)
      .eq("is_primary", true)
      .single();

    if (data) {
      setContact(data);
    }
  };

  const handleSave = async (formData: FormData) => {
    const supabase = createClient();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    startTransition(async () => {
      if (contact) {
        await supabase
          .from("emergency_contacts")
          .update({ name, phone: phone || null, email: email || null })
          .eq("id", contact.id);
      } else {
        await supabase.from("emergency_contacts").insert({
          property_id: propertyId,
          name,
          phone: phone || null,
          email: email || null,
          is_primary: true,
        });
      }
      await fetchContact();
      setIsEditing(false);
      onDataChange?.();
    });
  };

  if (!contact && !isEditing) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Emergency Contact</h2>
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <Phone className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No emergency contact added</p>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Add a contact for guests in case of emergencies
          </p>
          <Button variant="accent" onClick={() => setIsEditing(true)}>
            Add Contact
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Emergency Contact</h2>
        <form
          action={handleSave}
          className="rounded-xl border bg-card p-4 space-y-4"
        >
          <FormField
            label="Contact Name"
            name="name"
            type="text"
            defaultValue={contact?.name || ""}
            placeholder="e.g., Maria (Host)"
            required
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            defaultValue={contact?.phone || ""}
            placeholder="+356 9999 1234"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            defaultValue={contact?.email || ""}
            placeholder="host@example.com"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Contact"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // This should not happen due to earlier conditionals, but TypeScript guard
  if (!contact) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Emergency Contact</h2>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{contact.name}</p>
            <p className="text-sm text-muted-foreground">Primary Contact</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${contact.phone}`} className="hover:underline">
                {contact.phone}
              </a>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${contact.email}`} className="hover:underline">
                {contact.email}
              </a>
            </div>
          )}
          {!contact.phone && !contact.email && (
            <p className="text-sm text-muted-foreground">
              No contact details added
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
