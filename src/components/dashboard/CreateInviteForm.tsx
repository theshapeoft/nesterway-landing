"use client";

import { useState } from "react";
import { CalendarDays, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createInvite, type CreateInviteInput } from "@/lib/actions/invites";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
}

interface CreateInviteFormProps {
  properties: Property[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateInviteForm({
  properties,
  open,
  onOpenChange,
  onSuccess,
}: CreateInviteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form state
  const [propertyId, setPropertyId] = useState(properties[0]?.id || "");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [postCheckoutDays, setPostCheckoutDays] = useState(3);
  const [customMessage, setCustomMessage] = useState("");

  const resetForm = () => {
    setPropertyId(properties[0]?.id || "");
    setGuestName("");
    setGuestEmail("");
    setCheckInDate("");
    setCheckOutDate("");
    setLeadTimeDays(7);
    setPostCheckoutDays(3);
    setCustomMessage("");
    setError(null);
    setFieldErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!propertyId) {
      errors.propertyId = "Please select a property";
    }
    if (!guestName.trim()) {
      errors.guestName = "Guest name is required";
    }
    if (!guestEmail.trim()) {
      errors.guestEmail = "Guest email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      errors.guestEmail = "Please enter a valid email address";
    }
    if (!checkInDate) {
      errors.checkInDate = "Check-in date is required";
    }
    if (!checkOutDate) {
      errors.checkOutDate = "Check-out date is required";
    } else if (checkInDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      errors.checkOutDate = "Check-out must be after check-in";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const input: CreateInviteInput = {
        propertyId,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        checkInDate,
        checkOutDate,
        leadTimeDays,
        postCheckoutDays,
        customMessage: customMessage.trim() || undefined,
      };

      const result = await createInvite(input);

      if (!result.success) {
        setError(result.error || "Failed to create invite");
        return;
      }

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error creating invite:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Guest Invite</DialogTitle>
          <DialogDescription>
            Send a time-limited access code to your guest. They&apos;ll receive
            an email with their access details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Property Selection */}
          <div className="space-y-2">
            <label
              htmlFor="propertyId"
              className="block text-sm font-medium text-foreground"
            >
              Property <span className="text-destructive">*</span>
            </label>
            <select
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className={cn(
                "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                fieldErrors.propertyId
                  ? "border-destructive focus:ring-destructive"
                  : "border-border"
              )}
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
            {fieldErrors.propertyId && (
              <p className="text-sm text-destructive">{fieldErrors.propertyId}</p>
            )}
          </div>

          {/* Guest Name */}
          <div className="space-y-2">
            <label
              htmlFor="guestName"
              className="block text-sm font-medium text-foreground"
            >
              <User className="mr-1 inline h-4 w-4" />
              Guest Name <span className="text-destructive">*</span>
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
              className={cn(
                "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                fieldErrors.guestName
                  ? "border-destructive focus:ring-destructive"
                  : "border-border"
              )}
            />
            {fieldErrors.guestName && (
              <p className="text-sm text-destructive">{fieldErrors.guestName}</p>
            )}
          </div>

          {/* Guest Email */}
          <div className="space-y-2">
            <label
              htmlFor="guestEmail"
              className="block text-sm font-medium text-foreground"
            >
              <Mail className="mr-1 inline h-4 w-4" />
              Guest Email <span className="text-destructive">*</span>
            </label>
            <input
              id="guestEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="guest@example.com"
              className={cn(
                "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                fieldErrors.guestEmail
                  ? "border-destructive focus:ring-destructive"
                  : "border-border"
              )}
            />
            {fieldErrors.guestEmail && (
              <p className="text-sm text-destructive">{fieldErrors.guestEmail}</p>
            )}
          </div>

          {/* Check-in / Check-out Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="checkInDate"
                className="block text-sm font-medium text-foreground"
              >
                <CalendarDays className="mr-1 inline h-4 w-4" />
                Check-in Date <span className="text-destructive">*</span>
              </label>
              <input
                id="checkInDate"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={today}
                className={cn(
                  "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  fieldErrors.checkInDate
                    ? "border-destructive focus:ring-destructive"
                    : "border-border"
                )}
              />
              {fieldErrors.checkInDate && (
                <p className="text-sm text-destructive">
                  {fieldErrors.checkInDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="checkOutDate"
                className="block text-sm font-medium text-foreground"
              >
                <CalendarDays className="mr-1 inline h-4 w-4" />
                Check-out Date <span className="text-destructive">*</span>
              </label>
              <input
                id="checkOutDate"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || today}
                className={cn(
                  "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  fieldErrors.checkOutDate
                    ? "border-destructive focus:ring-destructive"
                    : "border-border"
                )}
              />
              {fieldErrors.checkOutDate && (
                <p className="text-sm text-destructive">
                  {fieldErrors.checkOutDate}
                </p>
              )}
            </div>
          </div>

          {/* Access Window */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="leadTimeDays"
                className="block text-sm font-medium text-foreground"
              >
                Lead Time (days before check-in)
              </label>
              <input
                id="leadTimeDays"
                type="number"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 0)}
                min={0}
                max={30}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-muted-foreground">
                Guest can access guide this many days before check-in
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="postCheckoutDays"
                className="block text-sm font-medium text-foreground"
              >
                Post-checkout (days after)
              </label>
              <input
                id="postCheckoutDays"
                type="number"
                value={postCheckoutDays}
                onChange={(e) =>
                  setPostCheckoutDays(parseInt(e.target.value) || 0)
                }
                min={0}
                max={30}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-muted-foreground">
                Guest retains access this many days after checkout
              </p>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <label
              htmlFor="customMessage"
              className="block text-sm font-medium text-foreground"
            >
              <MessageSquare className="mr-1 inline h-4 w-4" />
              Custom Welcome Message (optional)
            </label>
            <textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message for your guest..."
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {customMessage.length}/500 characters
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create & Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
