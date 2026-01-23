import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { propertyId, fullName, email, additionalGuests } = await req.json();

    // Validate required fields
    if (!propertyId || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify property exists and has registration enabled
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, require_guest_registration")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (!property.require_guest_registration) {
      return NextResponse.json(
        { error: "Registration not required for this property" },
        { status: 400 }
      );
    }

    // Get IP and user agent for analytics/compliance
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Insert guest registration
    const { error: insertError } = await supabase
      .from("guest_registrations")
      .insert({
        property_id: propertyId,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        additional_guests: additionalGuests || 0,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (insertError) {
      console.error("Error inserting guest registration:", insertError);
      return NextResponse.json(
        { error: "Failed to register" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guest registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
