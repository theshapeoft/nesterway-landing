"use client";

import { CountryHero, AreasGrid, CountryTips } from "@/components/country";
import type { Country } from "@/types";

interface CountryPageClientProps {
  country: Country;
}

export function CountryPageClient({ country }: CountryPageClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <CountryHero
        name={country.name}
        flag={country.flag}
        tagline={country.tagline}
        heroImageUrl={country.heroImageUrl}
      />

      <AreasGrid areas={country.areas} countrySlug={country.slug} />

      <CountryTips tips={country.tips} />
    </div>
  );
}
