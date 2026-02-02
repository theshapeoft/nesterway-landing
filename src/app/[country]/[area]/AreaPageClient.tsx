"use client";

import { useState, useMemo } from "react";
import {
  AreaHero,
  QuickStats,
  CategoryNav,
  RecommendationCard,
  LocalInsights,
} from "@/components/area";
import type { Area } from "@/types";

interface AreaPageClientProps {
  area: Area;
}

export function AreaPageClient({ area }: AreaPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecommendations = useMemo(() => {
    if (selectedCategory === null) {
      return area.recommendations;
    }
    return area.recommendations.filter((r) => r.category === selectedCategory);
  }, [area.recommendations, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <AreaHero
        name={area.name}
        tagline={area.tagline}
        countrySlug={area.countrySlug}
        countryName={area.countryName}
        areaSlug={area.slug}
        heroImageUrl={area.heroImageUrl}
      />

      <QuickStats
        vibe={area.vibe}
        bestFor={area.bestFor}
        gettingAround={area.gettingAround}
      />

      <CategoryNav
        categories={area.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Recommendations Grid */}
      <div className="px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {selectedCategory
              ? area.categories.find((c) => c.slug === selectedCategory)?.name ||
                "Recommendations"
              : "All Recommendations"}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredRecommendations.length})
            </span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              No recommendations found in this category.
            </p>
          )}
        </div>
      </div>

      <LocalInsights insights={area.localInsights} />
    </div>
  );
}
