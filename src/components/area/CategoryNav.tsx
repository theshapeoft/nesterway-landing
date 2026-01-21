"use client";

import { useState } from "react";
import {
  Utensils,
  Compass,
  Waves,
  Moon,
  ShoppingBag,
  Coffee,
  Camera,
  Palmtree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AreaCategory } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  utensils: <Utensils className="h-5 w-5" />,
  "food-drink": <Utensils className="h-5 w-5" />,
  compass: <Compass className="h-5 w-5" />,
  "things-to-do": <Compass className="h-5 w-5" />,
  waves: <Waves className="h-5 w-5" />,
  beaches: <Waves className="h-5 w-5" />,
  moon: <Moon className="h-5 w-5" />,
  nightlife: <Moon className="h-5 w-5" />,
  "shopping-bag": <ShoppingBag className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
  coffee: <Coffee className="h-5 w-5" />,
  camera: <Camera className="h-5 w-5" />,
  palmtree: <Palmtree className="h-5 w-5" />,
};

interface CategoryNavProps {
  categories: AreaCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  className?: string;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategoryNavProps) {
  return (
    <div className={cn("bg-background px-4 py-4", className)}>
      <div className="mx-auto max-w-2xl">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* All button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              "flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>

          {/* Category buttons */}
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onSelectCategory(category.slug)}
              className={cn(
                "flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {iconMap[category.slug] || iconMap[category.icon] || (
                <Compass className="h-5 w-5" />
              )}
              <span>{category.name}</span>
              <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                {category.recommendationCount}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
