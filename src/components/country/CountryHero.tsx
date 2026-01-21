"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountryHeroProps {
  name: string;
  flag: string;
  tagline: string;
  heroImageUrl?: string;
  className?: string;
}

export function CountryHero({
  name,
  flag,
  tagline,
  heroImageUrl,
  className,
}: CountryHeroProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Hero Image */}
      <div className="relative h-48 w-full overflow-hidden bg-secondary md:h-64">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Back navigation */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      {/* Country name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{flag}</span>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">{name}</h1>
            <p className="text-sm text-white/80 md:text-base">{tagline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
