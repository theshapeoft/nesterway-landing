"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  propertyName: string;
  className?: string;
}

/**
 * PWA Install Prompt - encourages guests to add the property guide to their home screen.
 * Uses the beforeinstallprompt event on supported browsers.
 * Falls back to iOS instructions on Safari.
 */
export function InstallPrompt({ propertyName, className = "" }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS Safari
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    // Check if user previously dismissed the prompt
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      const dismissedAt = parseInt(wasDismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show the manual instructions prompt after a delay
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds on iOS
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't show if already installed, dismissed, or not applicable
  if (isStandalone || dismissed || !isVisible) {
    return null;
  }

  // iOS Safari - show manual instructions
  if (isIOS) {
    return (
      <div className={`mx-auto max-w-lg px-4 ${className}`}>
        <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 shadow-sm">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-white/50"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-6">
            <div className="rounded-lg bg-primary/20 p-2">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Save to Home Screen
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap{" "}
                <span className="inline-flex items-center">
                  <svg className="mx-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a1 1 0 01-1 1h-4v4a1 1 0 01-2 0V9H4a1 1 0 010-2h4V3a1 1 0 012 0v4h4a1 1 0 011 1z"/>
                  </svg>
                </span>{" "}
                then &quot;Add to Home Screen&quot; for quick access to {propertyName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chrome/Android - show install button
  return (
    <div className={`mx-auto max-w-lg px-4 ${className}`}>
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 shadow-sm">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-white/50"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center justify-between gap-3 pr-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Add to Home Screen
              </p>
              <p className="text-xs text-muted-foreground">
                Quick access to your guide
              </p>
            </div>
          </div>
          
          <button
            onClick={handleInstallClick}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
