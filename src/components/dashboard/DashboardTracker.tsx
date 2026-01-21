"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

interface DashboardTrackerProps {
  propertyCount: number;
}

/**
 * Client component to track dashboard view analytics.
 * This is a render-less component that fires the tracking event on mount.
 */
export function DashboardTracker({ propertyCount }: DashboardTrackerProps) {
  useEffect(() => {
    track("dashboard_viewed", { property_count: propertyCount });
  }, [propertyCount]);

  return null;
}
