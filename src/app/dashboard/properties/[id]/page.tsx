import { notFound } from "next/navigation";
import { getProperty } from "@/lib/actions/properties";
import { PropertyEditor } from "./PropertyEditor";

interface PropertyEditorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ duplicated?: string }>;
}

export default async function PropertyEditorPage({
  params,
  searchParams,
}: PropertyEditorPageProps) {
  const { id } = await params;
  const { duplicated } = await searchParams;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyEditor property={property} showDuplicatedToast={duplicated === "true"} />;
}
