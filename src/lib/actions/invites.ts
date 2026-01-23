"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendBrandedEmail } from "@/lib/email";
import type { GuestInvite, GuestInviteStatus } from "@/types";

// Database record type for guest invites
export interface DbGuestInvite {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  lead_time_days: number;
  post_checkout_days: number;
  access_code: string;
  custom_message: string | null;
  status: GuestInviteStatus;
  email_sent_at: string | null;
  email_resend_count: number;
  last_resend_at: string | null;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Property info for invite display
interface PropertyInfo {
  id: string;
  name: string;
  slug: string;
}

// Extended invite with property info
export interface InviteWithProperty extends DbGuestInvite {
  property: PropertyInfo;
}

// Transform database record to app type
function transformDbInvite(db: DbGuestInvite): GuestInvite {
  return {
    id: db.id,
    propertyId: db.property_id,
    guestName: db.guest_name,
    guestEmail: db.guest_email,
    checkInDate: db.check_in_date,
    checkOutDate: db.check_out_date,
    leadTimeDays: db.lead_time_days,
    postCheckoutDays: db.post_checkout_days,
    accessCode: db.access_code,
    customMessage: db.custom_message ?? undefined,
    status: db.status,
    emailSentAt: db.email_sent_at ?? undefined,
    emailResendCount: db.email_resend_count,
    lastResendAt: db.last_resend_at ?? undefined,
    lastAccessedAt: db.last_accessed_at ?? undefined,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// Generate 8-character access code
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing chars like 0,O,1,I
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface CreateInviteInput {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  leadTimeDays?: number;
  postCheckoutDays?: number;
  customMessage?: string;
}

export async function createInvite(
  input: CreateInviteInput
): Promise<{ success: boolean; invite?: GuestInvite; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify user owns this property
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id, name, slug, host_id, host_display_name")
    .eq("id", input.propertyId)
    .eq("host_id", user.id)
    .single();

  if (propertyError || !property) {
    return { success: false, error: "Property not found" };
  }

  // Generate unique access code
  let accessCode = generateAccessCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from("guest_invites")
      .select("id")
      .eq("access_code", accessCode)
      .single();

    if (!existing) break;
    accessCode = generateAccessCode();
    attempts++;
  }

  if (attempts >= 10) {
    return { success: false, error: "Failed to generate unique access code" };
  }

  // Calculate access window
  const checkInDate = new Date(input.checkInDate);
  const checkOutDate = new Date(input.checkOutDate);
  const leadTimeDays = input.leadTimeDays ?? 7;
  const postCheckoutDays = input.postCheckoutDays ?? 3;

  // Validate dates
  if (checkOutDate <= checkInDate) {
    return { success: false, error: "Check-out date must be after check-in date" };
  }

  // Create the invite
  const { data: invite, error: insertError } = await supabase
    .from("guest_invites")
    .insert({
      property_id: input.propertyId,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      check_in_date: input.checkInDate,
      check_out_date: input.checkOutDate,
      lead_time_days: leadTimeDays,
      post_checkout_days: postCheckoutDays,
      access_code: accessCode,
      custom_message: input.customMessage || null,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !invite) {
    console.error("Error creating invite:", insertError);
    return { success: false, error: "Failed to create invite" };
  }

  // Calculate access window dates for email
  const accessStartDate = new Date(checkInDate);
  accessStartDate.setDate(accessStartDate.getDate() - leadTimeDays);

  const accessEndDate = new Date(checkOutDate);
  accessEndDate.setDate(accessEndDate.getDate() + postCheckoutDays);

  // Get host display name for email
  const hostName = property.host_display_name || "Your Host";

  // Get host email for reply-to
  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const hostEmail = hostProfile?.email || user.email;

  // Build guide URL with access code
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travelama.com";
  const guideUrl = `${baseUrl}/stay/${property.slug}?code=${accessCode}`;

  // Send invite email
  const emailResult = await sendBrandedEmail({
    to: input.guestEmail,
    subject: `Welcome to ${property.name} - Your Digital Guide`,
    category: "guest-invite",
    replyTo: hostEmail,
    template: {
      heading: `Welcome to ${property.name}!`,
      paragraphs: [
        `Hi ${input.guestName},`,
        `Your digital guide for ${property.name} is ready!`,
        `📅 <strong>Your Stay:</strong> ${formatDate(input.checkInDate)} to ${formatDate(input.checkOutDate)}`,
        `🔑 <strong>Access Code:</strong> ${accessCode}`,
        `Your guide will be available starting ${formatDate(accessStartDate.toISOString().split("T")[0])} and accessible until ${formatDate(accessEndDate.toISOString().split("T")[0])}.`,
        input.customMessage ? `<em>${input.customMessage}</em>` : "",
        `Need help? Contact ${hostName} directly by replying to this email.`,
      ].filter(Boolean),
      button: {
        label: "View Your Guide",
        url: guideUrl,
      },
      signature: `Welcome!\n${hostName}`,
    },
  });

  // Update email sent status
  if (emailResult.success) {
    await supabase
      .from("guest_invites")
      .update({
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", invite.id);
  } else {
    console.error("Failed to send invite email:", emailResult.error);
  }

  revalidatePath("/dashboard/invites");
  return { success: true, invite: transformDbInvite(invite) };
}

export async function getInvites(): Promise<InviteWithProperty[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Get all properties for this user
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, slug")
    .eq("host_id", user.id)
    .eq("is_deleted", false);

  if (!properties || properties.length === 0) {
    return [];
  }

  const propertyIds = properties.map((p) => p.id);

  // Get invites for all user's properties
  const { data: invites, error } = await supabase
    .from("guest_invites")
    .select("*")
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invites:", error);
    return [];
  }

  // Map property info to invites
  const propertyMap = new Map(properties.map((p) => [p.id, p]));

  return (invites || []).map((invite) => ({
    ...invite,
    property: propertyMap.get(invite.property_id) || {
      id: invite.property_id,
      name: "Unknown Property",
      slug: "",
    },
  }));
}

export async function resendInviteEmail(
  inviteId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get the invite with property info
  const { data: invite, error: inviteError } = await supabase
    .from("guest_invites")
    .select("*, properties!inner(id, name, slug, host_id, host_display_name)")
    .eq("id", inviteId)
    .single();

  if (inviteError || !invite) {
    return { success: false, error: "Invite not found" };
  }

  // Verify ownership
  if (invite.properties.host_id !== user.id) {
    return { success: false, error: "Not authorized" };
  }

  // Check resend limit (max 2 per 24 hours)
  if (invite.email_resend_count >= 2 && invite.last_resend_at) {
    const lastResend = new Date(invite.last_resend_at);
    const now = new Date();
    const hoursSinceLastResend =
      (now.getTime() - lastResend.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastResend < 24) {
      const hoursRemaining = Math.ceil(24 - hoursSinceLastResend);
      return {
        success: false,
        error: `Resend limit reached. Try again in ${hoursRemaining} hour${hoursRemaining === 1 ? "" : "s"}.`,
      };
    }

    // Reset counter after 24 hours
    invite.email_resend_count = 0;
  }

  // Get host email for reply-to
  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const hostEmail = hostProfile?.email || user.email;
  const hostName = invite.properties.host_display_name || "Your Host";

  // Calculate access window dates for email
  const checkInDate = new Date(invite.check_in_date);
  const checkOutDate = new Date(invite.check_out_date);

  const accessStartDate = new Date(checkInDate);
  accessStartDate.setDate(accessStartDate.getDate() - invite.lead_time_days);

  const accessEndDate = new Date(checkOutDate);
  accessEndDate.setDate(accessEndDate.getDate() + invite.post_checkout_days);

  // Build guide URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travelama.com";
  const guideUrl = `${baseUrl}/stay/${invite.properties.slug}?code=${invite.access_code}`;

  // Send email
  const emailResult = await sendBrandedEmail({
    to: invite.guest_email,
    subject: `Reminder: Your Digital Guide for ${invite.properties.name}`,
    category: "guest-invite-resend",
    replyTo: hostEmail,
    template: {
      heading: `Your Digital Guide Awaits`,
      paragraphs: [
        `Hi ${invite.guest_name},`,
        `This is a reminder that your digital guide for ${invite.properties.name} is ready!`,
        `📅 <strong>Your Stay:</strong> ${formatDate(invite.check_in_date)} to ${formatDate(invite.check_out_date)}`,
        `🔑 <strong>Access Code:</strong> ${invite.access_code}`,
        `Your guide is available from ${formatDate(accessStartDate.toISOString().split("T")[0])} until ${formatDate(accessEndDate.toISOString().split("T")[0])}.`,
        invite.custom_message ? `<em>${invite.custom_message}</em>` : "",
        `Need help? Contact ${hostName} directly by replying to this email.`,
      ].filter(Boolean),
      button: {
        label: "View Your Guide",
        url: guideUrl,
      },
      signature: `Welcome!\n${hostName}`,
    },
  });

  if (!emailResult.success) {
    console.error("Failed to resend invite email:", emailResult.error);
    return { success: false, error: "Failed to send email" };
  }

  // Update resend tracking
  await supabase
    .from("guest_invites")
    .update({
      email_resend_count: invite.email_resend_count + 1,
      last_resend_at: new Date().toISOString(),
    })
    .eq("id", inviteId);

  revalidatePath("/dashboard/invites");
  return { success: true };
}

export async function deleteInvite(
  inviteId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get the invite to verify ownership
  const { data: invite, error: inviteError } = await supabase
    .from("guest_invites")
    .select("*, properties!inner(host_id)")
    .eq("id", inviteId)
    .single();

  if (inviteError || !invite) {
    return { success: false, error: "Invite not found" };
  }

  // Verify ownership
  if (invite.properties.host_id !== user.id) {
    return { success: false, error: "Not authorized" };
  }

  // Delete the invite
  const { error: deleteError } = await supabase
    .from("guest_invites")
    .delete()
    .eq("id", inviteId);

  if (deleteError) {
    console.error("Error deleting invite:", deleteError);
    return { success: false, error: "Failed to delete invite" };
  }

  revalidatePath("/dashboard/invites");
  return { success: true };
}

export async function revokeInvite(
  inviteId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get the invite to verify ownership
  const { data: invite, error: inviteError } = await supabase
    .from("guest_invites")
    .select("*, properties!inner(host_id)")
    .eq("id", inviteId)
    .single();

  if (inviteError || !invite) {
    return { success: false, error: "Invite not found" };
  }

  // Verify ownership
  if (invite.properties.host_id !== user.id) {
    return { success: false, error: "Not authorized" };
  }

  // Revoke the invite
  const { error: updateError } = await supabase
    .from("guest_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId);

  if (updateError) {
    console.error("Error revoking invite:", updateError);
    return { success: false, error: "Failed to revoke invite" };
  }

  revalidatePath("/dashboard/invites");
  return { success: true };
}
