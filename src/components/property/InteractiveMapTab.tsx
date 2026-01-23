"use client";

import { useState, useCallback, useMemo } from "react";
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";
import { Loader2, Navigation, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapCategory, MapPin } from "@/types";

const libraries: ("places")[] = ["places"];

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default map options for a clean look
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Color mappings for category colors to marker colors
const categoryColorToMarker: Record<string, string> = {
  blue: "#3B82F6",
  red: "#EF4444",
  yellow: "#F59E0B",
  green: "#22C55E",
  purple: "#A855F7",
  orange: "#F97316",
};

// Category color to tailwind bg classes
const categoryColorToBg: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  yellow: "bg-amber-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

interface InteractiveMapTabProps {
  categories: MapCategory[];
  pins: MapPin[];
  showPropertyAddress?: boolean;
  propertyAddress?: string;
  propertyLatitude?: number;
  propertyLongitude?: number;
}

export function InteractiveMapTab({
  categories,
  pins,
  showPropertyAddress = false,
  propertyLatitude,
  propertyLongitude,
}: InteractiveMapTabProps) {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.id))
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries,
  });

  // Calculate map center based on pins or property location
  const mapCenter = useMemo(() => {
    if (propertyLatitude && propertyLongitude) {
      return { lat: propertyLatitude, lng: propertyLongitude };
    }
    if (pins.length > 0) {
      const avgLat = pins.reduce((sum, p) => sum + p.latitude, 0) / pins.length;
      const avgLng = pins.reduce((sum, p) => sum + p.longitude, 0) / pins.length;
      return { lat: avgLat, lng: avgLng };
    }
    // Default to a central location if no data
    return { lat: 35.9, lng: 14.5 }; // Malta as default
  }, [pins, propertyLatitude, propertyLongitude]);

  // Filter pins based on visible categories
  const visiblePins = useMemo(() => {
    return pins.filter((pin) => visibleCategories.has(pin.categoryId));
  }, [pins, visibleCategories]);

  // Get category for a pin
  const getCategoryForPin = useCallback(
    (pin: MapPin) => {
      return categories.find((c) => c.id === pin.categoryId);
    },
    [categories]
  );

  // Pin count per category
  const pinCountByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pin of pins) {
      const count = counts.get(pin.categoryId) || 0;
      counts.set(pin.categoryId, count + 1);
    }
    return counts;
  }, [pins]);

  // Toggle category visibility
  const toggleCategory = (categoryId: string) => {
    setVisibleCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Show all categories
  const showAllCategories = () => {
    setVisibleCategories(new Set(categories.map((c) => c.id)));
  };

  // Hide all categories
  const hideAllCategories = () => {
    setVisibleCategories(new Set());
  };

  // Open directions in Google Maps
  const openDirections = (pin: MapPin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pin.latitude},${pin.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loadError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-900 text-white/70">
        <X className="h-8 w-8 text-red-500" />
        <p>Failed to load map. Please try again later.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-900 text-white/70">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        options={mapOptions}
        onClick={() => setSelectedPin(null)}
      >
        {/* Property location marker */}
        {showPropertyAddress && propertyLatitude && propertyLongitude && (
          <MarkerF
            position={{ lat: propertyLatitude, lng: propertyLongitude }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#000000",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
            }}
            title="Property Location"
            zIndex={1000}
          />
        )}

        {/* Pin markers */}
        {visiblePins.map((pin) => {
          const category = getCategoryForPin(pin);
          const markerColor = category
            ? categoryColorToMarker[category.color]
            : "#3B82F6";

          return (
            <MarkerF
              key={pin.id}
              position={{ lat: pin.latitude, lng: pin.longitude }}
              onClick={() => setSelectedPin(pin)}
              icon={{
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          );
        })}

        {/* Info window for selected pin */}
        {selectedPin && (
          <InfoWindowF
            position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
            onCloseClick={() => setSelectedPin(null)}
          >
            <div className="max-w-[250px] p-1">
              <h3 className="font-semibold text-gray-900">{selectedPin.title}</h3>
              {selectedPin.address && (
                <p className="mt-1 text-sm text-gray-600">{selectedPin.address}</p>
              )}
              {selectedPin.description && (
                <p className="mt-2 text-sm text-gray-700">{selectedPin.description}</p>
              )}
              <button
                onClick={() => openDirections(selectedPin)}
                className="mt-3 flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      {/* Category filter panel - floating */}
      <div
        className={cn(
          "absolute left-3 top-3 z-10 max-h-[calc(100%-80px)] overflow-hidden rounded-xl bg-neutral-900/95 backdrop-blur-lg shadow-xl transition-all duration-300",
          isFilterOpen ? "w-64" : "w-auto"
        )}
      >
        {/* Filter toggle button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-white hover:bg-white/5"
        >
          <span className="text-sm font-medium">Filters</span>
          <span className="text-xs text-white/50">
            {visibleCategories.size}/{categories.length}
          </span>
        </button>

        {/* Filter content */}
        {isFilterOpen && (
          <div className="border-t border-white/10 px-3 py-2">
            {/* Quick actions */}
            <div className="mb-2 flex gap-2">
              <button
                onClick={showAllCategories}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              >
                Show All
              </button>
              <button
                onClick={hideAllCategories}
                className="flex-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
              >
                Hide All
              </button>
            </div>

            {/* Category checkboxes */}
            <div className="max-h-[200px] space-y-1 overflow-y-auto">
              {categories.map((category) => {
                const isVisible = visibleCategories.has(category.id);
                const count = pinCountByCategory.get(category.id) || 0;

                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-white hover:bg-white/10"
                    aria-pressed={isVisible}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                        isVisible
                          ? "border-primary bg-primary"
                          : "border-white/30 bg-transparent"
                      )}
                    >
                      {isVisible && <Check className="h-3 w-3 text-white" />}
                    </div>

                    {/* Color dot */}
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full",
                        categoryColorToBg[category.color]
                      )}
                    />

                    {/* Category name and count */}
                    <span className="flex-1 text-sm">{category.title}</span>
                    <span className="text-xs text-white/50">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
