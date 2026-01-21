"use client";

import Image from "next/image";
import { Phone, EnvelopeSimple, ShareNetwork } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PropertyHeaderProps {
  name: string;
  welcomeMessage?: string;
  hostName?: string;
  hostPhotoUrl?: string;
  heroImageUrl?: string;
  onContactClick?: () => void;
  className?: string;
}

export function PropertyHeader({
  name,
  welcomeMessage,
  hostName,
  hostPhotoUrl,
  heroImageUrl,
  onContactClick,
  className,
}: PropertyHeaderProps) {
  const hasHeroImage = Boolean(heroImageUrl);

  return (
    <header
      className={cn(
        "relative min-h-[65vh] flex flex-col justify-end overflow-hidden",
        className
      )}
    >
      {/* Background - Image or Gradient Fallback */}
      <div className="absolute inset-0">
        {hasHeroImage ? (
          <Image
            src={heroImageUrl!}
            alt={`${name} property`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          /* Beautiful gradient fallback when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900">
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 -right-1/4 w-80 h-80 bg-ocean-600/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          </div>
        )}
        {/* Gradient Overlay - warm amber tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-neutral-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent mix-blend-overlay" />
      </div>

      {/* Top Actions Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigator.share?.({ title: name, url: window.location.href })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/90 transition-all hover:bg-white/20 active:scale-95"
            aria-label="Share property"
          >
            <ShareNetwork weight="bold" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 px-5 pb-20 pt-16">
        <div className="mx-auto max-w-lg">
          {/* Host Avatar & Contact Row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Host Avatar */}
              <div className="relative">
                {hostPhotoUrl ? (
                  <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/30 ring-offset-2 ring-offset-transparent">
                    <Image
                      src={hostPhotoUrl}
                      alt={hostName ? `${hostName}'s photo` : "Host photo"}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold ring-2 ring-white/30 ring-offset-2 ring-offset-transparent">
                    {hostName?.[0]?.toUpperCase() || "H"}
                  </div>
                )}
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success-400 ring-2 ring-neutral-900" />
              </div>
              {hostName && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                    Your Host
                  </p>
                  <p className="text-base font-semibold text-white">{hostName}</p>
                </div>
              )}
            </div>

            {/* Quick Contact Icons */}
            <div className="flex gap-2">
              <button
                onClick={onContactClick}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20 active:scale-95"
                aria-label="Call host"
              >
                <Phone weight="fill" className="h-5 w-5" />
              </button>
              <button
                onClick={onContactClick}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white transition-all hover:bg-white/20 active:scale-95"
                aria-label="Email host"
              >
                <EnvelopeSimple weight="fill" className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Property Name */}
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-widest text-primary animate-fade-in">
              Welcome to
            </p>
            <h1
              className="text-3xl font-bold text-white leading-tight md:text-4xl"
              style={{ animationDelay: "50ms" }}
            >
              {name}
            </h1>
          </div>

          {/* Welcome Message */}
          {welcomeMessage && (
            <p
              className="mt-3 text-sm leading-relaxed text-white/80 line-clamp-2 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              {welcomeMessage}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Curve Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-background rounded-t-3xl" />
    </header>
  );
}
