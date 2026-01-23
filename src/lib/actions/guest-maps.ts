"use server";

import { createClient } from "@/lib/supabase/server";
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

// Result type for guest map data
export interface GuestMapData {
  map: PropertyMap;
  categories: MapCategory[];
  pins: MapPin[];
}

/**
 * Fetch map data for a guest viewing a property.
 * This relies on RLS policies that allow public access to maps
 * that are assigned to published properties.
 */
export async function getGuestMapData(
  mapId: string
): Promise<GuestMapData | null> {
  const supabase = await createClient();

  // Fetch the map (RLS allows public access for maps assigned to published properties)
  const { data: map, error: mapError } = await supabase
    .from("maps")
    .select("*")
    .eq("id", mapId)
    .single();

  if (mapError || !map) {
    console.error("Error fetching map for guest:", mapError);
    return null;
  }

  // Fetch categories for the map
  const { data: categories, error: catError } = await supabase
    .from("map_categories")
    .select("*")
    .eq("map_id", mapId)
    .order("order_index", { ascending: true });

  if (catError) {
    console.error("Error fetching map categories:", catError);
    return null;
  }

  // Fetch all pins for these categories
  const categoryIds = (categories || []).map((c) => c.id);
  let pins: DbMapPin[] = [];

  if (categoryIds.length > 0) {
    const { data: pinData, error: pinError } = await supabase
      .from("map_pins")
      .select("*")
      .in("category_id", categoryIds)
      .order("created_at", { ascending: true });

    if (pinError) {
      console.error("Error fetching map pins:", pinError);
      return null;
    }

    pins = pinData || [];
  }

  return {
    map: transformDbMap(
      map as DbMap,
      (categories || []).map(transformDbCategory),
      pins.length
    ),
    categories: (categories || []).map(transformDbCategory),
    pins: pins.map(transformDbPin),
  };
}
