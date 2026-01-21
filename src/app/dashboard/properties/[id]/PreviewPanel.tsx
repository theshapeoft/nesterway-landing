"use client";

import { useState, useEffect, useRef } from "react";
import { Smartphone, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import {
  PropertyHeader,
  QuickAccessBar,
  PropertySections,
} from "@/components/property";
import type { Property } from "@/types";
import type { DbProperty } from "@/lib/actions/properties";
import { fetchPropertyForPreview } from "@/lib/utils/property-preview";

interface PreviewPanelProps {
  property: DbProperty;
  onClose: () => void;
  refreshTrigger: number;
}

export function PreviewPanel({
  property,
  onClose,
  refreshTrigger,
}: PreviewPanelProps) {
  const [previewData, setPreviewData] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastRefreshRef = useRef(refreshTrigger);

  // Fetch preview data on mount and when refreshTrigger changes
  useEffect(() => {
    const fetchPreview = async () => {
      // Only show loading state for initial load, not refreshes
      if (lastRefreshRef.current === refreshTrigger) {
        setIsLoading(true);
      }
      lastRefreshRef.current = refreshTrigger;

      try {
        const data = await fetchPropertyForPreview(property);
        setPreviewData(data);
      } catch (error) {
        console.error("Error fetching preview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [property, refreshTrigger]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPropertyForPreview(property);
      setPreviewData(data);
    } catch (error) {
      console.error("Error refreshing preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col border-l bg-muted/30">
      {/* Preview Header */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <span>Guest Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh preview"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            title="Close preview"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content - Mobile Frame */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="mx-auto h-full max-w-[375px] overflow-hidden rounded-2xl border-4 border-foreground/10 bg-background shadow-xl">
          {/* Mobile "notch" indicator */}
          <div className="flex h-6 items-center justify-center bg-background">
            <div className="h-1 w-16 rounded-full bg-foreground/10" />
          </div>

          {/* Scrollable preview content */}
          <div className="h-[calc(100%-1.5rem)] overflow-y-auto">
            {isLoading && !previewData ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading preview...
                  </p>
                </div>
              </div>
            ) : previewData ? (
              <div className="min-h-screen bg-background">
                {/* Hero Header */}
                <PropertyHeader
                  name={previewData.name}
                  welcomeMessage={previewData.welcomeMessage}
                  hostName={previewData.hostName}
                  hostPhotoUrl={previewData.hostPhotoUrl}
                  heroImageUrl={previewData.heroImageUrl}
                  onContactClick={() => {}}
                />

                {/* Quick Access Bar - Floating over hero */}
                <QuickAccessBar
                  checkoutTime={previewData.checkoutTime}
                  onWifiClick={() => {}}
                  onEmergencyClick={() => {}}
                  exploreHref="#"
                  areaName={previewData.areaName}
                />

                {/* Property Sections */}
                <PropertySections sections={previewData.sections} />

                {/* Bottom padding for mobile navigation area */}
                <div className="h-20" />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Unable to load preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
