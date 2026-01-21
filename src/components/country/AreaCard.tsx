"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AreaSummary } from "@/types";

interface AreaCardProps {
  area: AreaSummary;
  countrySlug: string;
  className?: string;
}

export function AreaCard({ area, countrySlug, className }: AreaCardProps) {
  return (
    <Link
      href={`/${countrySlug}/${area.slug}`}
      className={cn(
        "group block overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-32 w-full overflow-hidden bg-secondary">
        {area.imageUrl ? (
          <Image
            src={area.imageUrl}
            alt={area.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {area.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {area.tagline}
        </p>
      </div>
    </Link>
  );
}
