import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendBrandedEmail } from "@/lib/email";

interface DbProperty {
  id: string;
  name: string;
  host_id: string;
  slug: string;
}

interface DbProfile {
  id: string;
  email: string;
  full_name: string | null;
}


// Rate limit: 1 request per email per property per 24 hours
async function checkRateLimit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyId: string,
  guestEmail: string
): Promise<boolean> {
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { data } = await supabase
    .from("access_requests")
    .select("id")
    .eq("property_id", propertyId)
    .eq("guest_email", guestEmail.toLowerCase().trim())
    .gte("created_at", twentyFourHoursAgo)
    .limit(1);

  // If any request exists in the last 24 hours, rate limit exceeded
  return !data || data.length === 0;
}

export async function POST(req: NextRequest) {
  try {
    const { propertyId, guestName, guestEmail, message } = await req.json();

    // Validate required fields
    if (!propertyId || !guestName || !guestEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Validate message length
    if (message && message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check rate limit
    const withinRateLimit = await checkRateLimit(supabase, propertyId, guestEmail);
    if (!withinRateLimit) {
      return NextResponse.json(
        { error: "You have already sent a request for this property. Please wait 24 hours before trying again." },
        { status: 429 }
      );
    }

    // Get property with host info
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, name, host_id, slug")
      .eq("id", propertyId)
      .single<DbProperty>();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Get host profile (email)
    const { data: hostProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", property.host_id)
      .single<DbProfile>();

    if (profileError || !hostProfile || !hostProfile.email) {
      console.error("Host profile not found:", profileError);
      return NextResponse.json(
        { error: "Unable to contact property host" },
        { status: 500 }
      );
    }

    // Record the access request for rate limiting
    const { error: insertError } = await supabase.from("access_requests").insert({
      property_id: propertyId,
      guest_name: guestName.trim(),
      guest_email: guestEmail.toLowerCase().trim(),
      message: message?.trim() || null,
    });

    if (insertError) {
      console.error("Failed to record access request:", insertError);
      // Continue anyway - email sending is more important
    }

    // Build email content
    const invitesUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://travelama.com"}/dashboard/invites?prefill_email=${encodeURIComponent(guestEmail)}`;

    const paragraphs = [
      `A guest has requested access to your property guide "${property.name}".`,
      `<strong>Name:</strong> ${escapeHtml(guestName)}`,
      `<strong>Email:</strong> ${escapeHtml(guestEmail)}`,
    ];

    if (message && message.trim()) {
      paragraphs.push(`<strong>Message:</strong> ${escapeHtml(message.trim())}`);
    }

    paragraphs.push(
      "Click the button below to create an invite for this guest, or reply directly to this email."
    );

    // Send email to host
    const emailResult = await sendBrandedEmail({
      to: hostProfile.email,
      subject: `Access Request for ${property.name}`,
      category: "access-request",
      replyTo: guestEmail,
      template: {
        heading: "New Access Request",
        paragraphs,
        button: {
          label: "Create Invite",
          url: invitesUrl,
        },
        signature: "The Travelama Team",
      },
    });

    if (!emailResult.success) {
      console.error("Failed to send access request email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Access request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper to escape HTML special characters
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
