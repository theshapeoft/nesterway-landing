"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const libraries: ("places")[] = ["places"];

export interface LocationData {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface LocationInputProps {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  value?: LocationData | null;
  onChange?: (location: LocationData | null) => void;
}

export function LocationInput({
  label = "Location",
  error,
  hint = "Search for your property address",
  disabled = false,
  required = false,
  value,
  onChange,
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value?.address || "");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (value?.address) {
      setInputValue(value.address);
    }
  }, [value?.address]);

  const extractAddressComponent = useCallback(
    (
      components: google.maps.GeocoderAddressComponent[] | undefined,
      type: string
    ): string => {
      if (!components) return "";
      const component = components.find((c) => c.types.includes(type));
      return component?.long_name || "";
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry?.location) {
      onChange?.(null);
      return;
    }

    const components = place.address_components;

    const city =
      extractAddressComponent(components, "locality") ||
      extractAddressComponent(components, "postal_town") ||
      extractAddressComponent(components, "administrative_area_level_1");

    const country = extractAddressComponent(components, "country");

    const locationData: LocationData = {
      address: place.formatted_address || "",
      city,
      country,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      placeId: place.place_id || "",
    };

    setInputValue(locationData.address);
    onChange?.(locationData);
  }, [onChange, extractAddressComponent]);

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === "") {
      onChange?.(null);
    }
  };

  const inputId = "location-input";

  if (loadError) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="w-full rounded-lg border border-destructive bg-background px-4 py-3 text-sm text-destructive">
          Failed to load location search. Please check your API key.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="w-full rounded-lg border border-border bg-background px-4 py-3 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading location search...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["address"],
          fields: [
            "address_components",
            "formatted_address",
            "geometry",
            "place_id",
          ],
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="Start typing an address..."
          className={cn(
            "w-full rounded-lg border bg-background px-4 py-3 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:ring-destructive"
              : "border-border"
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
        />
      </Autocomplete>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-destructive flex items-center gap-1"
        >
          <span>&#9888;</span> {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}

      {value && (
        <p className="text-sm text-muted-foreground">
          {value.city}, {value.country}
        </p>
      )}
    </div>
  );
}
