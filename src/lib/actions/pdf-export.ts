"use server";

import { createClient } from "@/lib/supabase/server";

// Types for PDF export data
export interface WiFiNetworkData {
  name: string;
  password: string;
  securityType: string;
  description?: string;
  isPrimary: boolean;
}

export interface HouseRuleData {
  text: string;
  severity: "critical" | "normal";
}

export interface ApplianceData {
  name: string;
  location?: string;
  instructions: string;
}

export interface EmergencyContactData {
  name: string;
  phone?: string;
  email?: string;
}

export interface CustomSectionData {
  title: string;
  icon: string;
  content: string[];
}

export interface MapPinData {
  title: string;
  address?: string;
  category: string;
  categoryColor: string;
}

export interface PropertyPdfData {
  // Basic info
  name: string;
  slug: string;
  address?: string;
  city?: string;
  country?: string;
  welcomeMessage?: string;
  hostName?: string;
  hostPhotoUrl?: string;
  heroImageUrl?: string;
  checkoutTime: string;
  // Content sections
  wifiNetworks: WiFiNetworkData[];
  houseRules: HouseRuleData[];
  appliances: ApplianceData[];
  emergencyContacts: EmergencyContactData[];
  customSections: CustomSectionData[];
  // Map data
  mapPins: MapPinData[];
  hasMap: boolean;
}

/**
 * Fetch all property data needed for PDF export
 */
export async function getPropertyPdfData(
  propertyId: string
): Promise<PropertyPdfData | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch property
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .eq("is_deleted", false)
    .single();

  if (propertyError || !property) {
    console.error("Error fetching property for PDF:", propertyError);
    return null;
  }

  // Fetch all related data in parallel
  const [
    { data: wifiNetworks },
    { data: sections },
    { data: emergencyContacts },
    { data: mapData },
  ] = await Promise.all([
    supabase
      .from("wifi_networks")
      .select("*")
      .eq("property_id", propertyId)
      .order("display_order"),
    supabase
      .from("property_sections")
      .select("*")
      .eq("property_id", propertyId)
      .eq("is_visible", true)
      .order("display_order"),
    supabase
      .from("emergency_contacts")
      .select("*")
      .eq("property_id", propertyId)
      .order("is_primary", { ascending: false }),
    // If property has an active map, fetch pins with categories
    property.active_map_id
      ? supabase
          .from("map_pins")
          .select(`
            *,
            category:map_categories!inner(id, title, color)
          `)
          .eq("category.map_id", property.active_map_id)
      : Promise.resolve({ data: [] }),
  ]);

  // Process sections by type
  const houseRules: HouseRuleData[] = [];
  const appliances: ApplianceData[] = [];
  const customSections: CustomSectionData[] = [];

  (sections || []).forEach((section) => {
    if (section.section_type === "house_rules" && Array.isArray(section.content)) {
      section.content.forEach((rule: { text?: string; severity?: string } | string) => {
        if (typeof rule === "object" && rule.text) {
          houseRules.push({
            text: rule.text,
            severity: (rule.severity as "critical" | "normal") || "normal",
          });
        } else if (typeof rule === "string") {
          houseRules.push({ text: rule, severity: "normal" });
        }
      });
    } else if (section.section_type === "appliances" && Array.isArray(section.content)) {
      section.content.forEach((appliance: { name?: string; location?: string; instructions?: string } | string) => {
        if (typeof appliance === "object" && appliance.name) {
          appliances.push({
            name: appliance.name,
            location: appliance.location,
            instructions: appliance.instructions || "",
          });
        }
      });
    } else if (section.section_type === "custom" && Array.isArray(section.content)) {
      customSections.push({
        title: section.title,
        icon: section.icon || "info",
        content: section.content.map((item: string | { text: string }) =>
          typeof item === "string" ? item : item.text || ""
        ),
      });
    }
  });

  // Format checkout time
  const formatTime = (time: string | null): string => {
    if (!time) return "11:00 AM";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Process map pins
  const mapPins: MapPinData[] = (mapData || []).map((pin) => ({
    title: pin.title,
    address: pin.address,
    category: (pin.category as { title: string })?.title || "Other",
    categoryColor: (pin.category as { color: string })?.color || "blue",
  }));

  return {
    name: property.name,
    slug: property.slug,
    address: property.address || undefined,
    city: property.city || undefined,
    country: property.country || undefined,
    welcomeMessage: property.welcome_message || undefined,
    hostName: property.host_display_name || undefined,
    hostPhotoUrl: property.host_photo_url || undefined,
    heroImageUrl: property.hero_image_url || undefined,
    checkoutTime: formatTime(property.checkout_time),
    wifiNetworks: (wifiNetworks || []).map((n) => ({
      name: n.name,
      password: n.password,
      securityType: n.security_type,
      description: n.description || undefined,
      isPrimary: n.is_primary,
    })),
    houseRules,
    appliances,
    emergencyContacts: (emergencyContacts || []).map((c) => ({
      name: c.name,
      phone: c.phone || undefined,
      email: c.email || undefined,
    })),
    customSections,
    mapPins,
    hasMap: !!property.active_map_id && mapPins.length > 0,
  };
}
