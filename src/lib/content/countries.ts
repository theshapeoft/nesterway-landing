import type { Country } from "@/types";
import { maltaCountry } from "@/content/countries/malta";

// Static content for MVP - will be replaced with database fetch
const countries: Record<string, Country> = {
  malta: maltaCountry,
};

export async function getCountry(slug: string): Promise<Country | null> {
  return countries[slug] || null;
}

export async function getAllCountrySlugs(): Promise<string[]> {
  return Object.keys(countries);
}

export async function getAllCountries(): Promise<Country[]> {
  return Object.values(countries);
}
