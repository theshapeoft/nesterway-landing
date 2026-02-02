"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, X, Share2, MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";

interface FeedbackPromptProps {
  propertyId: string;
  propertyName: string;
  checkoutTime: string; // Format: "11:00 AM"
  className?: string;
}

type FeedbackState = "idle" | "prompt" | "positive" | "negative" | "dismissed";

/**
 * Guest NPS feedback prompt - shows near checkout time.
 * Positive feedback triggers a referral prompt.
 */
export function FeedbackPrompt({
  propertyId,
  propertyName,
  checkoutTime,
  className = "",
}: FeedbackPromptProps) {
  const [state, setState] = useState<FeedbackState>("idle");
  const [isNearCheckout, setIsNearCheckout] = useState(false);

  // Check if we're within 24 hours before checkout
  useEffect(() => {
    const checkTime = () => {
      // Parse checkout time (e.g., "11:00 AM")
      const match = checkoutTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) {
        // Default to showing the prompt if we can't parse
        setIsNearCheckout(true);
        return;
      }

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const isPM = match[3].toUpperCase() === "PM";

      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      // Get current time
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Check if within 24 hours before checkout (assuming same day or next day)
      // Simplified: show between 6 PM the night before and checkout time
      const checkoutMinutes = hours * 60 + minutes;
      const currentMinutes = currentHour * 60 + currentMinute;

      // Show from 6 PM (18:00) until checkout
      const showFromMinutes = 18 * 60; // 6 PM

      // If current time is after 6 PM, or before checkout time on checkout day
      if (currentMinutes >= showFromMinutes || currentMinutes <= checkoutMinutes) {
        setIsNearCheckout(true);
      }
    };

    checkTime();
    // Check every hour
    const interval = setInterval(checkTime, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkoutTime]);

  // Check if user already gave feedback
  useEffect(() => {
    const feedbackKey = `travelama-feedback-${propertyId}`;
    const existingFeedback = localStorage.getItem(feedbackKey);
    
    if (existingFeedback) {
      setState("dismissed");
      return;
    }

    // Only show prompt if near checkout
    if (isNearCheckout) {
      // Small delay before showing
      const timer = setTimeout(() => {
        setState("prompt");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [propertyId, isNearCheckout]);

  const handleFeedback = (isPositive: boolean) => {
    // Track feedback
    track("feedback_submitted", {
      property_id: propertyId,
      feedback: isPositive ? "positive" : "negative",
    });

    // Save to localStorage
    localStorage.setItem(`travelama-feedback-${propertyId}`, isPositive ? "positive" : "negative");

    // Show appropriate follow-up
    setState(isPositive ? "positive" : "negative");
  };

  const handleDismiss = () => {
    setState("dismissed");
    localStorage.setItem(`travelama-feedback-${propertyId}`, "dismissed");
  };

  const handleShare = async () => {
    const shareData = {
      title: "Travelama - Digital Guest Guides",
      text: "I used Travelama during my stay - it made finding property info and local tips super easy! Perfect for vacation rental hosts.",
      url: "https://travelama.com",
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        track("referral_shared", { property_id: propertyId, method: "native" });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n\n${shareData.url}`
        );
        track("referral_shared", { property_id: propertyId, method: "clipboard" });
        alert("Link copied! Share it with hosts you know.");
      }
    } catch {
      // User cancelled or error
    }

    setState("dismissed");
  };

  // Don't show if not ready or already dismissed
  if (state === "idle" || state === "dismissed") {
    return null;
  }

  // Initial feedback prompt
  if (state === "prompt") {
    return (
      <div className={`mx-auto max-w-lg px-4 ${className}`}>
        <div className="relative rounded-xl bg-white p-4 shadow-md ring-1 ring-black/5">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-neutral-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-6">
            <p className="text-center text-sm font-medium text-foreground">
              Was this guide helpful during your stay?
            </p>
            
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => handleFeedback(true)}
                className="flex items-center gap-2 rounded-full bg-green-50 px-6 py-2.5 text-sm font-medium text-green-700 transition-all hover:bg-green-100 active:scale-95"
              >
                <ThumbsUp className="h-5 w-5" />
                Yes!
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex items-center gap-2 rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-200 active:scale-95"
              >
                <ThumbsDown className="h-5 w-5" />
                Not really
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Positive feedback - show referral prompt
  if (state === "positive") {
    return (
      <div className={`mx-auto max-w-lg px-4 ${className}`}>
        <div className="relative rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 shadow-md">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-white/50"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
            
            <p className="text-sm font-medium text-foreground">
              Glad you found it helpful! 🎉
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Know a host who could use Travelama?
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                <Share2 className="h-4 w-4" />
                Share Travelama
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Negative feedback - simple thank you
  if (state === "negative") {
    return (
      <div className={`mx-auto max-w-lg px-4 ${className}`}>
        <div className="relative rounded-xl bg-white p-4 shadow-md ring-1 ring-black/5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <MessageCircle className="h-6 w-6 text-neutral-500" />
            </div>
            
            <p className="text-sm font-medium text-foreground">
              Thanks for the feedback
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              We&apos;re always working to improve!
            </p>

            <button
              onClick={handleDismiss}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
