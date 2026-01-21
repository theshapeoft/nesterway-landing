"use client";

import { useState, useEffect, useCallback } from "react";
import type { Property } from "@/types";

const PROPERTY_CACHE_KEY = "travelama-property-cache";

interface CachedPropertyData {
  property: Property;
  version: string;
  timestamp: number;
}

export function useOffline(property?: Property) {
  const [isOffline, setIsOffline] = useState(false);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Set initial state
    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Service Worker registered:", registration.scope);
          setIsServiceWorkerReady(true);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available
                  console.log("[SW] New version available");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[SW] Service Worker registration failed:", error);
        });
    }
  }, []);

  // Cache property data when available
  const cachePropertyData = useCallback(
    (propertyData: Property) => {
      if (!isServiceWorkerReady || !navigator.serviceWorker.controller) {
        // Fallback to localStorage if SW not ready
        try {
          const cacheData: CachedPropertyData = {
            property: propertyData,
            version: propertyData.id, // Use ID as version
            timestamp: Date.now(),
          };
          localStorage.setItem(
            `${PROPERTY_CACHE_KEY}-${propertyData.slug}`,
            JSON.stringify(cacheData)
          );
        } catch {
          console.warn("[Offline] Failed to cache to localStorage");
        }
        return;
      }

      // Send to service worker
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_PROPERTY",
        slug: propertyData.slug,
        data: propertyData,
        version: propertyData.id,
      });

      // Also cache to localStorage as backup
      try {
        const cacheData: CachedPropertyData = {
          property: propertyData,
          version: propertyData.id,
          timestamp: Date.now(),
        };
        localStorage.setItem(
          `${PROPERTY_CACHE_KEY}-${propertyData.slug}`,
          JSON.stringify(cacheData)
        );
      } catch {
        // localStorage might be full or unavailable
      }
    },
    [isServiceWorkerReady]
  );

  // Get cached property data
  const getCachedProperty = useCallback(
    (slug: string): Property | null => {
      try {
        const cached = localStorage.getItem(`${PROPERTY_CACHE_KEY}-${slug}`);
        if (cached) {
          const data: CachedPropertyData = JSON.parse(cached);
          // Cache is valid for 7 days
          const maxAge = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - data.timestamp < maxAge) {
            return data.property;
          }
        }
      } catch {
        // Failed to read cache
      }
      return null;
    },
    []
  );

  // Cache property on mount if available
  useEffect(() => {
    if (property) {
      cachePropertyData(property);
    }
  }, [property, cachePropertyData]);

  // Check if critical data is cached for this property
  const hasCachedData = useCallback(
    (slug: string): boolean => {
      return getCachedProperty(slug) !== null;
    },
    [getCachedProperty]
  );

  return {
    isOffline,
    isServiceWorkerReady,
    cachePropertyData,
    getCachedProperty,
    hasCachedData,
  };
}

// Get cache version for a property (used for invalidation)
export function getCacheVersion(slug: string): string | null {
  try {
    const cached = localStorage.getItem(`${PROPERTY_CACHE_KEY}-${slug}`);
    if (cached) {
      const data: CachedPropertyData = JSON.parse(cached);
      return data.version;
    }
  } catch {
    // Failed to read cache
  }
  return null;
}

// Clear cache for a specific property
export function clearPropertyCache(slug: string): void {
  try {
    localStorage.removeItem(`${PROPERTY_CACHE_KEY}-${slug}`);
  } catch {
    // Failed to clear cache
  }
}

// Clear all property caches
export function clearAllPropertyCaches(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(PROPERTY_CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Failed to clear caches
  }
}
