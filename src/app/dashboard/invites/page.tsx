import { Mail, Plus } from "lucide-react";
import { getProperties } from "@/lib/actions/properties";
import { getInvites } from "@/lib/actions/invites";
import { InvitesPageClient } from "./InvitesPageClient";

export default async function InvitesPage() {
  const [properties, invites] = await Promise.all([
    getProperties(),
    getInvites(),
  ]);

  // Transform properties for the form
  const propertyOptions = properties.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <InvitesPageClient
      properties={propertyOptions}
      invites={invites}
      hasProperties={properties.length > 0}
    />
  );
}

export function EmptyState({
  hasProperties,
  onCreateClick,
}: {
  hasProperties: boolean;
  onCreateClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        No invites yet
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        {hasProperties
          ? "Create your first invite to give guests time-limited access to your property guides."
          : "Create a property first, then you can invite guests to access your guides."}
      </p>
      {hasProperties && onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Your First Invite
        </button>
      )}
    </div>
  );
}
