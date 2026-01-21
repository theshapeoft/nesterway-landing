"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AreaHeroProps {
  name: string;
  tagline: string;
  countrySlug: string;
  countryName: string;
  heroImageUrl?: string;
  className?: string;
}

export function AreaHero({
  name,
  tagline,
  countrySlug,
  countryName,
  heroImageUrl,
  className,
}: AreaHeroProps) {
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
