"use client";

import { useState, useEffect } from "react";
import {
  PropertyHeader,
  QuickAccessBar,
  WiFiModal,
  EmergencyModal,
  PropertySections,
  BottomNavigation,
  OfflineIndicator,
  AccessRestricted,
} from "@/components/property";
import { Toast, useToast } from "@/components/ui";
import type { Property } from "@/types";
import type { NavTab } from "@/components/property/BottomNavigation";
import { track } from "@/lib/analytics";
import { useOffline } from "@/hooks";

interface PropertyPageClientProps {
  property: Property;
}

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const { toast, showToast, hideToast } = useToast();
  const { isOffline, hasCachedData } = useOffline(property);

  // Track page view on mount (this represents a QR scan or direct visit)
  useEffect(() => {
    track("property_viewed", { property_id: property.id, slug: property.slug });
  }, [property.id, property.slug]);

  // Check if property is invite-only and user doesn't have access
  // For now, always show restricted page for invite-only properties
  // In the future, this will check for valid access codes/invites
  if (property.accessMode === "invite_only") {
    return <AccessRestricted property={property} />;
  }

  const handleWifiCopySuccess = () => {
    showToast("Password copied!", "success");
    track("wifi_copied", { property_id: property.id });
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    // For now, scroll to sections based on tab
    // In future, could implement actual navigation views
    if (tab === "info") {
      document.getElementById("property-sections")?.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

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
