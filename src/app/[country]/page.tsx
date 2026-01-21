import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry, getAllCountrySlugs } from "@/lib/content/countries";
import { CountryPageClient } from "./CountryPageClient";

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCountrySlugs();
  return slugs.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = await getCountry(countrySlug);

  if (!country) {
    return {
      title: "Country Not Found — Travelama",
    };
  }

  return {
    title: `${country.name} ${country.flag} — Travelama`,
    description: country.tagline,
    openGraph: {
      title: `${country.name} — Travelama`,
      description: country.tagline,
      images: country.heroImageUrl ? [country.heroImageUrl] : undefined,
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const country = await getCountry(countrySlug);

  if (!country) {
    notFound();
  }

  return <CountryPageClient country={country} />;
}
