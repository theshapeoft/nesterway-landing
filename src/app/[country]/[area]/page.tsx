import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArea, getAllAreaSlugs } from "@/lib/content/areas";
import { AreaPageClient } from "./AreaPageClient";

interface AreaPageProps {
  params: Promise<{
    country: string;
    area: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllAreaSlugs();
  return slugs.map(({ country, area }) => ({ country, area }));
}

export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const { country, area: areaSlug } = await params;
  const area = await getArea(country, areaSlug);

  if (!area) {
    return {
      title: "Area Not Found — Travelama",
    };
  }

  return {
    title: `${area.name}, ${area.countryName} — Travelama`,
    description: `${area.tagline}. ${area.vibe}`,
    openGraph: {
      title: `${area.name} — Travelama`,
      description: area.tagline,
      images: area.heroImageUrl ? [area.heroImageUrl] : undefined,
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { country, area: areaSlug } = await params;
  const area = await getArea(country, areaSlug);

  if (!area) {
    notFound();
  }

  return <AreaPageClient area={area} />;
}
