"use client";

import { useState, useCallback } from "react";
import { Users, Share2, Check, ExternalLink } from "lucide-react";
import { track } from "@/lib/analytics";

interface ReferralPromptProps {
  className?: string;
}

export function ReferralPrompt({ className }: ReferralPromptProps) {
  const [showCopied, setShowCopied] = useState(false);

  const referralUrl = "https://travelama.com";
  const referralText = "I just used this awesome guest guide for my stay! If you have a rental property, check out Travelama - it makes creating digital property guides super easy.";

  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Travelama - Digital Guest Guides",
      text: referralText,
      url: referralUrl,
    };

    // Track share attempt
    track("referral_prompt_clicked", {});

    // Try Web Share API first (works on mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        track("referral_shared", { method: "native" });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to copy
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(referralUrl);
      setShowCopied(true);
      track("referral_shared", { method: "clipboard" });
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return (
    <div className={`mx-4 mb-24 ${className || ""}`}>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/50 p-6 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-6 w-6 text-primary" />
        </div>

        {/* Heading */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Know someone with a rental?
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground">
          Tell them about Travelama! Create beautiful digital guides for guests in minutes.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showCopied ? (
              <>
                <Check className="h-4 w-4" />
                Link copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share Travelama
              </>
            )}
          </button>
          
          <a
            href={referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("referral_link_clicked", {})}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ExternalLink className="h-4 w-4" />
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}
