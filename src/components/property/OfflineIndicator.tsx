"use client";

import { WifiSlash, CloudCheck, CloudSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  isOffline: boolean;
  hasCachedData?: boolean;
  className?: string;
}

export function OfflineIndicator({
  isOffline,
  hasCachedData = false,
  className,
}: OfflineIndicatorProps) {
  if (!isOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium",
        hasCachedData
          ? "bg-amber-100 text-amber-800"
          : "bg-red-100 text-red-800",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2">
        {hasCachedData ? (
          <>
            <CloudCheck weight="bold" className="h-4 w-4" />
            <span>You&apos;re offline — viewing cached information</span>
          </>
        ) : (
          <>
            <CloudSlash weight="bold" className="h-4 w-4" />
            <span>You&apos;re offline — some features may be unavailable</span>
          </>
        )}
      </div>
    </div>
  );
}

// Compact version for use in headers
export function OfflineBadge({
  isOffline,
  className,
}: {
  isOffline: boolean;
  className?: string;
}) {
  if (!isOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800",
        className
      )}
    >
      <WifiSlash weight="bold" className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
}
