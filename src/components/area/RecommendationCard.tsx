"use client";

import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
}

export function RecommendationCard({
  recommendation,
  className,
}: RecommendationCardProps) {
  const {
    name,
    cuisineType,
    description,
    priceRange,
    distance,
    imageUrl,
    googleMapsQuery,
    badge,
  } = recommendation;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}`;

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
            <span className="text-4xl font-bold text-primary/40">{name[0]}</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            {cuisineType && (
              <p className="text-sm text-muted-foreground">{cuisineType}</p>
            )}
          </div>
          {priceRange && (
            <span className="flex-shrink-0 text-sm font-medium text-primary">
              {priceRange}
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          {distance && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {distance}
            </span>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View on Map
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
