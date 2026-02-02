"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface AreaHeroProps {
  name: string;
  tagline: string;
  countrySlug: string;
  countryName: string;
  areaSlug: string;
  heroImageUrl?: string;
  className?: string;
}

export function AreaHero({
  name,
  tagline,
  countrySlug,
  countryName,
  areaSlug,
  heroImageUrl,
  className,
}: AreaHeroProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/${countrySlug}/${areaSlug}`;
    const shareData = {
      title: `${name} - Local Guide`,
      text: `Check out this local guide for ${name}, ${countryName}! Great recommendations for places to visit.`,
      url: shareUrl,
    };

    // Track share attempt
    track("area_share_clicked", { area: areaSlug, country: countrySlug });

    // Try Web Share API first (works on mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        track("area_shared", { area: areaSlug, method: "native" });
        return;
      } catch (err) {
        // User cancelled or share failed, fall through to copy
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      track("area_shared", { area: areaSlug, method: "clipboard" });
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [name, countryName, countrySlug, areaSlug]);

  return (
    <div className={cn("relative", className)}>
      {/* Hero Image */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary md:h-64">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={`${name} destination`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
            <span className="text-6xl font-bold text-primary/30">{name[0]}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Back button */}
      <Link
        href={`/${countrySlug}`}
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-card"
      >
        <ArrowLeft className="h-4 w-4" />
        {countryName}
      </Link>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-card"
        aria-label="Share this guide"
      >
        {showCopied ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </>
        )}
      </button>

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold drop-shadow-md md:text-4xl">{name}</h1>
          <p className="mt-1 text-white/90 drop-shadow-sm">{tagline}</p>
        </div>
      </div>
    </div>
  );
}
