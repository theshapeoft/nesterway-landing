"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PropertyMap, MapCategory, MapPin, MapCategoryColor } from "@/types";

// Database record types
interface DbMap {
  id: string;
  user_id: string;
  title: string;
  show_property_address: boolean;
  created_at: string;
  updated_at: string;
}

interface DbMapCategory {
  id: string;
  map_id: string;
  title: string;
  color: MapCategoryColor;
  order_index: number;
  created_at: string;
}

interface DbMapPin {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  place_id: string | null;
  address: string | null;
  created_at: string;
}

// Transform functions
function transformDbMap(db: DbMap, categories?: MapCategory[], pinCount?: number): PropertyMap {
  return {
    id: db.id,
    userId: db.user_id,
    title: db.title,
    showPropertyAddress: db.show_property_address,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    categories,
    pinCount,
  };
}

function transformDbCategory(db: DbMapCategory): MapCategory {
  return {
    id: db.id,
    mapId: db.map_id,
    title: db.title,
    color: db.color,
    orderIndex: db.order_index,
    createdAt: db.created_at,
  };
}

function transformDbPin(db: DbMapPin): MapPin {
  return {
    id: db.id,
    categoryId: db.category_id,
    title: db.title,
    description: db.description ?? undefined,
    latitude: db.latitude,
    longitude: db.longitude,
    placeId: db.place_id ?? undefined,
    address: db.address ?? undefined,
    createdAt: db.created_at,
  };
}

// ============ MAP CRUD ============

export interface CreateMapInput {
  title: string;
  showPropertyAddress?: boolean;
  categories?: { title: string; color: MapCategoryColor }[];
}

export async function createMap(
  input: CreateMapInput
): Promise<{ success: boolean; map?: PropertyMap; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Create the map
  const { data: map, error: mapError } = await supabase
    .from("maps")
    .insert({
      user_id: user.id,
      title: input.title,
      show_property_address: input.showPropertyAddress ?? true,
    })
    .select()
    .single();

  if (mapError || !map) {
    console.error("Error creating map:", mapError);
    return { success: false, error: "Failed to create map" };
  }

  // Create initial categories if provided
  const categories: MapCategory[] = [];
  if (input.categories && input.categories.length > 0) {
    const { data: createdCategories, error: categoryError } = await supabase
      .from("map_categories")
      .insert(
        input.categories.map((cat, index) => ({
          map_id: map.id,
          title: cat.title,
          color: cat.color,
          order_index: index,
        }))
      )
      .select();

    if (categoryError) {
      console.error("Error creating categories:", categoryError);
      // Map was created but categories failed - still return success with map
    } else if (createdCategories) {
      categories.push(...createdCategories.map(transformDbCategory));
    }
  }

  revalidatePath("/dashboard/properties");
  return {
    success: true,
    map: transformDbMap(map as DbMap, categories, 0),
  };
}

export async function getMaps(): Promise<PropertyMap[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Get all maps for the user
  const { data: maps, error } = await supabase
    .from("maps")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !maps) {
    console.error("Error fetching maps:", error);
    return [];
  }

  // Get categories for all maps
  const mapIds = maps.map((m) => m.id);
  const { data: categories } = await supabase
    .from("map_categories")
    .select("*")
    .in("map_id", mapIds)
    .order("order_index", { ascending: true });

  // Get pin counts per category
  const categoryIds = (categories || []).map((c) => c.id);
  const { data: pins } = await supabase
    .from("map_pins")
    .select("category_id")
    .in("category_id", categoryIds);

  // Build category map and pin counts
  const categoryByMap = new Map<string, MapCategory[]>();
  const pinCountByCategory = new Map<string, number>();

  if (pins) {
    for (const pin of pins) {
      const count = pinCountByCategory.get(pin.category_id) || 0;
      pinCountByCategory.set(pin.category_id, count + 1);
    }
  }

  if (categories) {
    for (const cat of categories) {
      const mapCategories = categoryByMap.get(cat.map_id) || [];
      mapCategories.push(transformDbCategory(cat as DbMapCategory));
      categoryByMap.set(cat.map_id, mapCategories);
    }
  }

  // Calculate total pin count per map
  return maps.map((map) => {
    const mapCategories = categoryByMap.get(map.id) || [];
    let totalPins = 0;
    for (const cat of mapCategories) {
      totalPins += pinCountByCategory.get(cat.id) || 0;
    }
    return transformDbMap(map as DbMap, mapCategories, totalPins);
  });
}

export async function getMap(mapId: string): Promise<PropertyMap | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get the map
  const { data: map, error } = await supabase
    .from("maps")
    .select("*")
    .eq("id", mapId)
    .eq("user_id", user.id)
    .single();

  if (error || !map) {
    return null;
  }

  // Get categories
  const { data: categories } = await supabase
    .from("map_categories")
    .select("*")
    .eq("map_id", mapId)
    .order("order_index", { ascending: true });

  // Get pin count
  const categoryIds = (categories || []).map((c) => c.id);
  const { count: pinCount } = await supabase
    .from("map_pins")
    .select("*", { count: "exact", head: true })
    .in("category_id", categoryIds);

  return transformDbMap(
    map as DbMap,
    (categories || []).map(transformDbCategory),
    pinCount || 0
  );
}

export async function updateMap(
  mapId: string,
  updates: { title?: string; showPropertyAddress?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const updateData: Record<string, unknown> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.showPropertyAddress !== undefined)
    updateData.show_property_address = updates.showPropertyAddress;

  const { error } = await supabase
    .from("maps")
    .update(updateData)
    .eq("id", mapId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating map:", error);
    return { success: false, error: "Failed to update map" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function deleteMap(
  mapId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Delete the map (cascade will delete categories and pins)
  const { error } = await supabase
    .from("maps")
    .delete()
    .eq("id", mapId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting map:", error);
    return { success: false, error: "Failed to delete map" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

// ============ CATEGORY CRUD ============

export async function createCategory(
  mapId: string,
  input: { title: string; color: MapCategoryColor }
): Promise<{ success: boolean; category?: MapCategory; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", mapId)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Map not found" };
  }

  // Get current max order_index
  const { data: categories } = await supabase
    .from("map_categories")
    .select("order_index")
    .eq("map_id", mapId)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder = categories && categories.length > 0 ? categories[0].order_index + 1 : 0;

  // Create the category
  const { data: category, error } = await supabase
    .from("map_categories")
    .insert({
      map_id: mapId,
      title: input.title,
      color: input.color,
      order_index: nextOrder,
    })
    .select()
    .single();

  if (error || !category) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true, category: transformDbCategory(category as DbMapCategory) };
}

export async function updateCategory(
  categoryId: string,
  updates: { title?: string; color?: MapCategoryColor }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get category and verify ownership through map
  const { data: category } = await supabase
    .from("map_categories")
    .select("map_id")
    .eq("id", categoryId)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", category.map_id)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Not authorized" };
  }

  const updateData: Record<string, unknown> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.color !== undefined) updateData.color = updates.color;

  const { error } = await supabase
    .from("map_categories")
    .update(updateData)
    .eq("id", categoryId);

  if (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get category and verify ownership through map
  const { data: category } = await supabase
    .from("map_categories")
    .select("map_id")
    .eq("id", categoryId)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", category.map_id)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Not authorized" };
  }

  // Delete the category (cascade will delete pins)
  const { error } = await supabase
    .from("map_categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function getCategories(mapId: string): Promise<MapCategory[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", mapId)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return [];
  }

  const { data: categories, error } = await supabase
    .from("map_categories")
    .select("*")
    .eq("map_id", mapId)
    .order("order_index", { ascending: true });

  if (error || !categories) {
    return [];
  }

  return categories.map((c) => transformDbCategory(c as DbMapCategory));
}

// ============ PIN CRUD ============

export interface CreatePinInput {
  categoryId: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  address?: string;
}

const MAX_PINS_PER_MAP = 100;

export async function createPin(
  input: CreatePinInput
): Promise<{ success: boolean; pin?: MapPin; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get category and verify ownership through map
  const { data: category } = await supabase
    .from("map_categories")
    .select("id, map_id")
    .eq("id", input.categoryId)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", category.map_id)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Not authorized" };
  }

  // Check pin limit (100 per map)
  const { data: allCategories } = await supabase
    .from("map_categories")
    .select("id")
    .eq("map_id", category.map_id);

  if (allCategories && allCategories.length > 0) {
    const categoryIds = allCategories.map((c) => c.id);
    const { count } = await supabase
      .from("map_pins")
      .select("*", { count: "exact", head: true })
      .in("category_id", categoryIds);

    if (count !== null && count >= MAX_PINS_PER_MAP) {
      return {
        success: false,
        error: `Pin limit reached (${MAX_PINS_PER_MAP} pins per map). Remove pins or contact support.`,
      };
    }
  }

  // Create the pin
  const { data: pin, error } = await supabase
    .from("map_pins")
    .insert({
      category_id: input.categoryId,
      title: input.title,
      description: input.description || null,
      latitude: input.latitude,
      longitude: input.longitude,
      place_id: input.placeId || null,
      address: input.address || null,
    })
    .select()
    .single();

  if (error || !pin) {
    console.error("Error creating pin:", error);
    return { success: false, error: "Failed to create pin" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true, pin: transformDbPin(pin as DbMapPin) };
}

export async function updatePin(
  pinId: string,
  updates: {
    title?: string;
    description?: string;
    categoryId?: string;
    latitude?: number;
    longitude?: number;
    placeId?: string;
    address?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get pin and its category
  const { data: pin } = await supabase
    .from("map_pins")
    .select("id, category_id")
    .eq("id", pinId)
    .single();

  if (!pin) {
    return { success: false, error: "Pin not found" };
  }

  // Get the category to find the map
  const { data: category } = await supabase
    .from("map_categories")
    .select("map_id")
    .eq("id", pin.category_id)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", category.map_id)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Not authorized" };
  }

  const updateData: Record<string, unknown> = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
  if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
  if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
  if (updates.placeId !== undefined) updateData.place_id = updates.placeId;
  if (updates.address !== undefined) updateData.address = updates.address;

  const { error } = await supabase.from("map_pins").update(updateData).eq("id", pinId);

  if (error) {
    console.error("Error updating pin:", error);
    return { success: false, error: "Failed to update pin" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function deletePin(
  pinId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get pin and its category
  const { data: pin } = await supabase
    .from("map_pins")
    .select("id, category_id")
    .eq("id", pinId)
    .single();

  if (!pin) {
    return { success: false, error: "Pin not found" };
  }

  // Get the category to find the map
  const { data: category } = await supabase
    .from("map_categories")
    .select("map_id")
    .eq("id", pin.category_id)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", category.map_id)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return { success: false, error: "Not authorized" };
  }

  // Delete the pin
  const { error } = await supabase.from("map_pins").delete().eq("id", pinId);

  if (error) {
    console.error("Error deleting pin:", error);
    return { success: false, error: "Failed to delete pin" };
  }

  revalidatePath("/dashboard/properties");
  return { success: true };
}

export async function getPins(mapId: string): Promise<MapPin[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Verify user owns the map
  const { data: map } = await supabase
    .from("maps")
    .select("id")
    .eq("id", mapId)
    .eq("user_id", user.id)
    .single();

  if (!map) {
    return [];
  }

  // Get all categories for this map
  const { data: categories } = await supabase
    .from("map_categories")
    .select("id")
    .eq("map_id", mapId);

  if (!categories || categories.length === 0) {
    return [];
  }

  const categoryIds = categories.map((c) => c.id);

  const { data: pins, error } = await supabase
    .from("map_pins")
    .select("*")
    .in("category_id", categoryIds)
    .order("created_at", { ascending: true });

  if (error || !pins) {
    return [];
  }

  return pins.map((p) => transformDbPin(p as DbMapPin));
}

// ============ PROPERTY MAP ASSIGNMENT ============

export async function assignMapToProperty(
  propertyId: string,
  mapId: string | null
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify user owns the property
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .single();

  if (!property) {
    return { success: false, error: "Property not found" };
  }

  // If mapId is provided, verify user owns the map
  if (mapId) {
    const { data: map } = await supabase
      .from("maps")
      .select("id")
      .eq("id", mapId)
      .eq("user_id", user.id)
      .single();

    if (!map) {
      return { success: false, error: "Map not found" };
    }
  }

  // Update the property's active_map_id
  const { error } = await supabase
    .from("properties")
    .update({ active_map_id: mapId })
    .eq("id", propertyId)
    .eq("host_id", user.id);

  if (error) {
    console.error("Error assigning map to property:", error);
    return { success: false, error: "Failed to assign map" };
  }

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function getPropertyActiveMap(propertyId: string): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: property } = await supabase
    .from("properties")
    .select("active_map_id")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .single();

  return property?.active_map_id || null;
}
