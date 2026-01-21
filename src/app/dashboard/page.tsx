import Link from "next/link";
import { Plus, Home } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getProperties } from "@/lib/actions/properties";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { DashboardTracker } from "@/components/dashboard/DashboardTracker";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const properties = await getProperties();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <DashboardTracker propertyCount={properties.length} />
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Your Properties
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Manage your property manuals here.
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="accent">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Home className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Welcome to Travelama!
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Create your first property to get started. Your guests will thank you
        for the digital manual.
      </p>
      <Link href="/dashboard/properties/new">
        <Button variant="accent" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Property
        </Button>
      </Link>
    </div>
  );
}
