"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Types for database records
export interface DbProperty {
  id: string;
  host_id: string;
  slug: string;
  name: string;
  area_slug: string | null;
  country_slug: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  place_id: string | null;
  welcome_message: string | null;
  host_display_name: string | null;
  host_photo_url: string | null;
  hero_image_url: string | null;
  checkout_time: string;
  status: "draft" | "published" | "archived";
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Generate a URL-friendly slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Ensure slug is unique by appending a number if needed
async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!data) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Generate a country slug from a country name
function generateCountrySlug(country: string | null): string | null {
  if (!country) return null;
  return country
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;

  // Location fields from Google Places
  const address = formData.get("address") as string | null;
  const city = formData.get("city") as string | null;
  const country = formData.get("country") as string | null;
  const latitudeStr = formData.get("latitude") as string | null;
  const longitudeStr = formData.get("longitude") as string | null;
  const placeId = formData.get("place_id") as string | null;

  if (!name || name.trim().length === 0) {
    return { error: "Property name is required" };
  }

  // Parse coordinates
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null;
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null;

  // Generate unique slug
  const baseSlug = generateSlug(name);
  const slug = await ensureUniqueSlug(supabase, baseSlug);

  // Generate country slug from country name for area guides integration
  const countrySlug = generateCountrySlug(country);

  const { data, error } = await supabase
    .from("properties")
    .insert({
      host_id: user.id,
      name: name.trim(),
      slug,
      address: address || null,
      city: city || null,
      country: country || null,
      latitude,
      longitude,
      place_id: placeId || null,
      country_slug: countrySlug,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating property:", error);
    return { error: "Failed to create property. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/properties/${data.id}`);
}

export async function getProperties(): Promise<DbProperty[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("host_id", user.id)
    .eq("is_deleted", false)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

export async function getProperty(id: string): Promise<DbProperty | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("host_id", user.id)
    .eq("is_deleted", false)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updates: Record<string, unknown> = {};

  // Extract form fields
  const name = formData.get("name") as string | null;
  const welcomeMessage = formData.get("welcome_message") as string | null;
  const hostDisplayName = formData.get("host_display_name") as string | null;
  const hostPhotoUrl = formData.get("host_photo_url") as string | null;
  const heroImageUrl = formData.get("hero_image_url") as string | null;
  const checkoutTime = formData.get("checkout_time") as string | null;

  if (name !== null) updates.name = name.trim();
  if (welcomeMessage !== null) updates.welcome_message = welcomeMessage.trim() || null;
  if (hostDisplayName !== null) updates.host_display_name = hostDisplayName.trim() || null;
  if (hostPhotoUrl !== null) updates.host_photo_url = hostPhotoUrl.trim() || null;
  if (heroImageUrl !== null) updates.hero_image_url = heroImageUrl.trim() || null;
  if (checkoutTime !== null) updates.checkout_time = checkoutTime;

  const { error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .eq("host_id", user.id);

  if (error) {
    console.error("Error updating property:", error);
    return { error: "Failed to update property" };
  }

  revalidatePath(`/dashboard/properties/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePropertyStatus(id: string, status: "draft" | "published") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", id)
    .eq("host_id", user.id);

  if (error) {
    console.error("Error updating property status:", error);
    return { error: "Failed to update status" };
  }

  revalidatePath(`/dashboard/properties/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Soft delete
  const { error } = await supabase
    .from("properties")
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("host_id", user.id);

  if (error) {
    console.error("Error deleting property:", error);
    return { error: "Failed to delete property" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function duplicateProperty(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch the original property
  const { data: original, error: fetchError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("host_id", user.id)
    .eq("is_deleted", false)
    .single();

  if (fetchError || !original) {
    console.error("Error fetching property:", fetchError);
    return { error: "Property not found" };
  }

  // Generate a unique slug for the copy
  const copyName = `${original.name} (Copy)`;
  const baseSlug = generateSlug(copyName);
  const newSlug = await ensureUniqueSlug(supabase, baseSlug);

  // Create the duplicate property
  const { data: newProperty, error: createError } = await supabase
    .from("properties")
    .insert({
      host_id: user.id,
      slug: newSlug,
      name: copyName,
      area_slug: original.area_slug,
      country_slug: original.country_slug,
      address: original.address,
      city: original.city,
      country: original.country,
      latitude: original.latitude,
      longitude: original.longitude,
      place_id: original.place_id,
      welcome_message: original.welcome_message,
      host_display_name: original.host_display_name,
      host_photo_url: original.host_photo_url,
      hero_image_url: original.hero_image_url,
      checkout_time: original.checkout_time,
      status: "draft", // New property starts as draft
    })
    .select()
    .single();

  if (createError || !newProperty) {
    console.error("Error creating duplicate property:", createError);
    return { error: "Failed to duplicate property" };
  }

  // Copy WiFi networks
  const { data: wifiNetworks } = await supabase
    .from("wifi_networks")
    .select("*")
    .eq("property_id", id);

  if (wifiNetworks && wifiNetworks.length > 0) {
    const wifiCopies = wifiNetworks.map((network) => ({
      property_id: newProperty.id,
      name: network.name,
      password: network.password,
      security_type: network.security_type,
      description: network.description,
      is_primary: network.is_primary,
      display_order: network.display_order,
    }));

    const { error: wifiError } = await supabase
      .from("wifi_networks")
      .insert(wifiCopies);

    if (wifiError) {
      console.error("Error copying WiFi networks:", wifiError);
    }
  }

  // Copy emergency contacts
  const { data: emergencyContacts } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("property_id", id);

  if (emergencyContacts && emergencyContacts.length > 0) {
    const contactCopies = emergencyContacts.map((contact) => ({
      property_id: newProperty.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      is_primary: contact.is_primary,
    }));

    const { error: contactError } = await supabase
      .from("emergency_contacts")
      .insert(contactCopies);

    if (contactError) {
      console.error("Error copying emergency contacts:", contactError);
    }
  }

  // Copy property sections (appliances, house_rules, custom)
  const { data: sections } = await supabase
    .from("property_sections")
    .select("*")
    .eq("property_id", id);

  if (sections && sections.length > 0) {
    const sectionCopies = sections.map((section) => ({
      property_id: newProperty.id,
      section_type: section.section_type,
      title: section.title,
      icon: section.icon,
      content: section.content,
      display_order: section.display_order,
      is_visible: section.is_visible,
    }));

    const { error: sectionError } = await supabase
      .from("property_sections")
      .insert(sectionCopies);

    if (sectionError) {
      console.error("Error copying property sections:", sectionError);
    }
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/properties/${newProperty.id}?duplicated=true`);
}
