import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface DbGuestInvite {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  lead_time_days: number;
  post_checkout_days: number;
  access_code: string;
  status: "pending" | "active" | "expired" | "revoked";
  last_accessed_at: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { propertyId, accessCode } = await req.json();

    // Validate required fields
    if (!propertyId || !accessCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find invite by access code and property
    const { data: invite, error: inviteError } = await supabase
      .from("guest_invites")
      .select("*")
      .eq("property_id", propertyId)
      .eq("access_code", accessCode.toUpperCase().trim())
      .single<DbGuestInvite>();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: "Invalid access code", valid: false },
        { status: 401 }
      );
    }

    // Check if invite is revoked
    if (invite.status === "revoked") {
      return NextResponse.json(
        { error: "This access code has been revoked", valid: false },
        { status: 401 }
      );
    }

    // Calculate access window
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(invite.check_in_date);
    const checkOutDate = new Date(invite.check_out_date);

    // Access starts: check_in_date - lead_time_days
    const accessStartDate = new Date(checkInDate);
    accessStartDate.setDate(accessStartDate.getDate() - invite.lead_time_days);

    // Access ends: check_out_date + post_checkout_days
    const accessEndDate = new Date(checkOutDate);
    accessEndDate.setDate(accessEndDate.getDate() + invite.post_checkout_days);

    // Check if within access window
    if (today < accessStartDate) {
      const daysUntilAccess = Math.ceil(
        (accessStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return NextResponse.json(
        {
          error: `Access not yet available. Your guide will be accessible in ${daysUntilAccess} day${daysUntilAccess === 1 ? "" : "s"}.`,
          valid: false,
          accessStartDate: accessStartDate.toISOString(),
        },
        { status: 401 }
      );
    }

    if (today > accessEndDate) {
      return NextResponse.json(
        {
          error: "This access code has expired",
          valid: false,
          expired: true,
        },
        { status: 401 }
      );
    }

    // Determine correct status based on dates
    let newStatus: "pending" | "active" | "expired" = invite.status;
    if (today >= accessStartDate && today <= accessEndDate) {
      newStatus = "active";
    } else if (today > accessEndDate) {
      newStatus = "expired";
    }

    // Update last_accessed_at and status if needed
    const updates: { last_accessed_at: string; status?: string } = {
      last_accessed_at: new Date().toISOString(),
    };
    if (newStatus !== invite.status) {
      updates.status = newStatus;
    }

    await supabase
      .from("guest_invites")
      .update(updates)
      .eq("id", invite.id);

    return NextResponse.json({
      valid: true,
      guestName: invite.guest_name,
      checkInDate: invite.check_in_date,
      checkOutDate: invite.check_out_date,
      accessStartDate: accessStartDate.toISOString(),
      accessEndDate: accessEndDate.toISOString(),
    });
  } catch (error) {
    console.error("Access code validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
