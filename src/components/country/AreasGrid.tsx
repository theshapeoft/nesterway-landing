"use client";

import { AreaCard } from "./AreaCard";
import { cn } from "@/lib/utils";
import type { AreaSummary } from "@/types";

interface AreasGridProps {
  areas: AreaSummary[];
  countrySlug: string;
  className?: string;
}

export function AreasGrid({ areas, countrySlug, className }: AreasGridProps) {
  if (areas.length === 0) {
    return (
      <div className={cn("px-4 py-8", className)}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">No areas available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-6", className)}>
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Explore Areas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map((area) => (
            <AreaCard key={area.slug} area={area} countrySlug={countrySlug} />
          ))}
        </div>
      </div>
    </div>
  );
}
