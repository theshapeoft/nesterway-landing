"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { Loader2, MapPin } from "lucide-react";

const libraries: ("places")[] = ["places"];

export interface PlaceData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface PlaceSearchInputProps {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  value?: PlaceData | null;
  onChange?: (place: PlaceData | null) => void;
  placeholder?: string;
}

export function PlaceSearchInput({
  label = "Location",
  error,
  hint = "Search for a place",
  disabled = false,
  required = false,
  value,
  onChange,
  placeholder = "Search for restaurants, attractions, etc.",
}: PlaceSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value?.name || "");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (value?.name) {
      setInputValue(value.name);
    }
  }, [value?.name]);

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry?.location) {
      onChange?.(null);
      return;
    }

    const placeData: PlaceData = {
      name: place.name || place.formatted_address || "",
      address: place.formatted_address || "",
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      placeId: place.place_id || "",
    };

    setInputValue(placeData.name);
    onChange?.(placeData);
  }, [onChange]);

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

  const inputId = `place-search-${label.toLowerCase().replace(/\s/g, "-")}`;

  if (loadError) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div className="w-full rounded-lg border border-destructive bg-background px-4 py-3 text-sm text-destructive">
          Failed to load location search. Please check your API key.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading location search...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["establishment"],
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "place_id",
          ],
        }}
      >
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
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
        </div>
      </Autocomplete>

      {error && (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1 text-sm text-destructive"
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
        <p className="text-sm text-muted-foreground">{value.address}</p>
      )}
    </div>
  );
}
