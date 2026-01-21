import { notFound } from "next/navigation";
import { getProperty } from "@/lib/actions/properties";
import { PropertyEditor } from "./PropertyEditor";

interface PropertyEditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyEditorPage({
  params,
}: PropertyEditorPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return <PropertyEditor property={property} />;
}
