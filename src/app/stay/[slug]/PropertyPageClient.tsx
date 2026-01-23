"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PropertyHeader,
  QuickAccessBar,
  WiFiModal,
  EmergencyModal,
  PropertySections,
  BottomNavigation,
  OfflineIndicator,
  AccessRestricted,
  GuestRegistrationGate,
  isGuestRegistered,
  getStoredAccessCode,
  InteractiveMapTab,
} from "@/components/property";
import { Toast, useToast } from "@/components/ui";
import type { Property, MapCategory, MapPin } from "@/types";
import type { NavTab } from "@/components/property/BottomNavigation";
import { track } from "@/lib/analytics";
import { useOffline } from "@/hooks";
import { getGuestMapData } from "@/lib/actions/guest-maps";

interface PropertyPageClientProps {
  property: Property;
}

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const { toast, showToast, hideToast } = useToast();
  const { isOffline, hasCachedData } = useOffline(property);

  // Check if guest registration is needed
  const [needsRegistration, setNeedsRegistration] = useState<boolean | null>(null);
  // Check if invite-only property needs access validation
  const [needsAccessCode, setNeedsAccessCode] = useState<boolean | null>(null);
  // Map data for interactive map tab
  const [mapCategories, setMapCategories] = useState<MapCategory[]>([]);
  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [mapLoading, setMapLoading] = useState(false);

  // Check access code status on mount (client-side only for invite-only properties)
  useEffect(() => {
    if (property.accessMode === "invite_only") {
      const storedCode = getStoredAccessCode(property.id);
      if (storedCode) {
        // Validate the stored code is still valid
        fetch("/api/validate-access-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            accessCode: storedCode,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setNeedsAccessCode(!data.valid);
          })
          .catch(() => {
            setNeedsAccessCode(true);
          });
      } else {
        setNeedsAccessCode(true);
      }
    } else {
      setNeedsAccessCode(false);
    }
  }, [property.id, property.accessMode]);

  // Check registration status on mount (client-side only)
  useEffect(() => {
    if (property.requireGuestRegistration) {
      setNeedsRegistration(!isGuestRegistered(property.id));
    } else {
      setNeedsRegistration(false);
    }
  }, [property.id, property.requireGuestRegistration]);

  // Fetch map data if property has an active map
  useEffect(() => {
    if (property.activeMapId) {
      setMapLoading(true);
      getGuestMapData(property.activeMapId)
        .then((data) => {
          if (data) {
            setMapCategories(data.categories);
            setMapPins(data.pins);
          }
        })
        .catch((err) => {
          console.error("Error fetching map data:", err);
        })
        .finally(() => {
          setMapLoading(false);
        });
    }
  }, [property.activeMapId]);

  // Handle registration completion
  const handleRegistrationComplete = useCallback(() => {
    setNeedsRegistration(false);
  }, []);

  // Handle access granted (for invite-only properties)
  const handleAccessGranted = useCallback(() => {
    setNeedsAccessCode(false);
  }, []);

  // Track page view on mount (this represents a QR scan or direct visit)
  useEffect(() => {
    track("property_viewed", { property_id: property.id, slug: property.slug });
  }, [property.id, property.slug]);

  // Show loading state while checking access code or registration status
  if (needsAccessCode === null || needsRegistration === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Show access restricted page for invite-only properties without valid access
  if (needsAccessCode) {
    return (
      <AccessRestricted
        property={property}
        onAccessGranted={handleAccessGranted}
      />
    );
  }

  // Show registration gate if guest needs to register
  if (needsRegistration) {
    return (
      <GuestRegistrationGate
        property={property}
        onRegistrationComplete={handleRegistrationComplete}
      />
    );
  }

  const handleWifiCopySuccess = () => {
    showToast("Password copied!", "success");
    track("wifi_copied", { property_id: property.id });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    // Handle tab-specific behavior
    if (tab === "info") {
      document.getElementById("property-sections")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "map" && property.activeMapId) {
      track("map_tab_viewed", { property_id: property.id });
    }
  };

  // Check if map tab should be shown
  const hasActiveMap = Boolean(property.activeMapId) && mapCategories.length > 0;

  // Show full-screen map view when map tab is active
  if (activeTab === "map" && hasActiveMap) {
    return (
      <div className="min-h-screen bg-background">
        {/* Offline Indicator */}
        <OfflineIndicator
          isOffline={isOffline}
          hasCachedData={hasCachedData(property.slug)}
        />

        {/* Full-screen map container */}
        <div className="fixed inset-0 bottom-[60px] z-0">
          {mapLoading ? (
            <div className="flex h-full items-center justify-center bg-neutral-900">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <InteractiveMapTab
              categories={mapCategories}
              pins={mapPins}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasMap={hasActiveMap}
        />

        {/* Toast notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Indicator */}
      <OfflineIndicator
        isOffline={isOffline}
        hasCachedData={hasCachedData(property.slug)}
      />

      {/* Hero Header */}
      <PropertyHeader
        name={property.name}
        welcomeMessage={property.welcomeMessage}
        hostName={property.hostName}
        hostPhotoUrl={property.hostPhotoUrl}
        heroImageUrl={property.heroImageUrl}
        onContactClick={() => setIsEmergencyOpen(true)}
      />

      {/* Quick Access Bar - Floating over hero */}
      <QuickAccessBar
        checkoutTime={property.checkoutTime}
        onWifiClick={() => setIsWifiOpen(true)}
        onEmergencyClick={() => setIsEmergencyOpen(true)}
        exploreHref={`/${property.countrySlug}/${property.areaSlug}`}
        areaName={property.areaName}
      />

      {/* Property Sections */}
      <div id="property-sections">
        <PropertySections sections={property.sections} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasMap={hasActiveMap}
      />

      {/* Modals */}
      <WiFiModal
        isOpen={isWifiOpen}
        onClose={() => setIsWifiOpen(false)}
        networks={property.wifi.networks}
        onCopySuccess={handleWifiCopySuccess}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        contact={property.emergencyContact}
        propertyName={property.name}
      />

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
