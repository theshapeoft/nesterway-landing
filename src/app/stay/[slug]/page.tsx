import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProperty } from "@/lib/content/properties";
import { PropertyPageClient } from "./PropertyPageClient";

// Force dynamic rendering since we fetch from database
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Property Not Found — Travelama",
    };
  }

  return {
    title: `${property.name} — Travelama`,
    description: `Property guide for ${property.name} in ${property.areaName}, ${property.countryName}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  return <PropertyPageClient property={property} />;
}
