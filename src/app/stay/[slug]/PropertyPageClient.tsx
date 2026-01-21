"use client";

import { useState } from "react";
import {
  PropertyHeader,
  QuickAccessBar,
  WiFiModal,
  EmergencyModal,
  PropertySections,
  BottomNavigation,
} from "@/components/property";
import { Toast, useToast } from "@/components/ui";
import type { Property } from "@/types";
import type { NavTab } from "@/components/property/BottomNavigation";

interface PropertyPageClientProps {
  property: Property;
}

export function PropertyPageClient({ property }: PropertyPageClientProps) {
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const { toast, showToast, hideToast } = useToast();

  const handleWifiCopySuccess = () => {
    showToast("Password copied!", "success");
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
