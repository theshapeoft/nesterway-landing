import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createProperty } from "@/lib/actions/properties";
import { CreatePropertyForm } from "./CreatePropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Properties
      </Link>

      {/* Card */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-foreground">
          Create New Property
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Add a new property to your portfolio. Choose a template to get started
          quickly, or start from scratch.
        </p>

        <CreatePropertyForm createProperty={createProperty} />
      </div>
    </div>
  );
}
