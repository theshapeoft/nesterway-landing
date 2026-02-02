import type { Property, WiFiNetwork, PropertySection, PropertyAccessMode } from "@/types";
import { createClient } from "@/lib/supabase/server";

// Area name mappings (expand as needed)
const areaNames: Record<string, string> = {
  sliema: "Sliema",
};

const countryNames: Record<string, string> = {
  malta: "Malta",
};

export async function getProperty(slug: string): Promise<Property | null> {
  const supabase = await createClient();

  // Fetch property from database
  const { data: dbProperty, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_deleted", false)
    .single();

  if (error || !dbProperty) {
    return null;
  }

  // Fetch wifi networks
  const { data: wifiNetworks } = await supabase
    .from("wifi_networks")
    .select("*")
    .eq("property_id", dbProperty.id)
    .order("display_order");

  // Fetch emergency contact
  const { data: emergencyContact } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("property_id", dbProperty.id)
    .eq("is_primary", true)
    .single();

  // Fetch property sections
  const { data: sections } = await supabase
    .from("property_sections")
    .select("*")
    .eq("property_id", dbProperty.id)
    .eq("is_visible", true)
    .order("display_order");

  // Transform to Property type
  const property: Property = {
    id: dbProperty.id,
    slug: dbProperty.slug,
    name: dbProperty.name,
    areaSlug: dbProperty.area_slug || "",
    areaName: areaNames[dbProperty.area_slug] || dbProperty.area_slug || "",
    countrySlug: dbProperty.country_slug || "",
    countryName: countryNames[dbProperty.country_slug] || dbProperty.country_slug || "",
    welcomeMessage: dbProperty.welcome_message || undefined,
    hostName: dbProperty.host_display_name || undefined,
    hostPhotoUrl: dbProperty.host_photo_url || undefined,
    heroImageUrl: dbProperty.hero_image_url || undefined,
    checkoutTime: formatTime(dbProperty.checkout_time),
    accessMode: (dbProperty.access_mode || "public") as PropertyAccessMode,
    requireGuestRegistration: dbProperty.require_guest_registration || false,
    hostWhatsapp: dbProperty.host_whatsapp || undefined,
    activeMapId: dbProperty.active_map_id || undefined,
    // Location data for weather widget
    latitude: dbProperty.latitude ? parseFloat(dbProperty.latitude) : undefined,
    longitude: dbProperty.longitude ? parseFloat(dbProperty.longitude) : undefined,
    city: dbProperty.city || undefined,
    wifi: {
      networks: (wifiNetworks || []).map((n): WiFiNetwork => ({
        name: n.name,
        password: n.password,
        type: n.security_type as "WPA" | "WEP" | "nopass",
        description: n.description || undefined,
        isPrimary: n.is_primary,
      })),
    },
    emergencyContact: emergencyContact
      ? {
          name: emergencyContact.name,
          phone: emergencyContact.phone || undefined,
          email: emergencyContact.email || undefined,
        }
      : { name: "Host" }, // Default fallback
    sections: (sections || []).map((s): PropertySection => ({
      id: s.id,
      title: s.title,
      icon: s.icon || "info",
      content: s.content as PropertySection["content"],
    })),
  };

  return property;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("properties")
    .select("slug")
    .eq("status", "published")
    .eq("is_deleted", false);

  return (data || []).map((p) => p.slug);
}

// Helper to format time from "11:00:00" to "11:00 AM"
function formatTime(time: string | null): string {
  if (!time) return "11:00 AM";

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
}
