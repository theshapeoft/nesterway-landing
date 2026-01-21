import type { Area } from "@/types";
import { sliemaArea } from "@/content/areas/malta/sliema";

// Static content for MVP - will be replaced with database fetch
const areas: Record<string, Record<string, Area>> = {
  malta: {
    sliema: sliemaArea,
  },
};

export async function getArea(
  countrySlug: string,
  areaSlug: string
): Promise<Area | null> {
  const countryAreas = areas[countrySlug];
  if (!countryAreas) return null;

  return countryAreas[areaSlug] || null;
}

export async function getAllAreaSlugs(): Promise<
  Array<{ country: string; area: string }>
> {
  const slugs: Array<{ country: string; area: string }> = [];

  for (const [countrySlug, countryAreas] of Object.entries(areas)) {
    for (const areaSlug of Object.keys(countryAreas)) {
      slugs.push({ country: countrySlug, area: areaSlug });
    }
  }

  return slugs;
}

export async function getAreasByCountry(countrySlug: string): Promise<Area[]> {
  const countryAreas = areas[countrySlug];
  if (!countryAreas) return [];

  return Object.values(countryAreas);
}
