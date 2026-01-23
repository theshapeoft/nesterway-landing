import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui";

export default function InvitesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Guest Invites
          </h1>
          <p className="text-muted-foreground">
            Create and manage time-limited access for your guests.
          </p>
        </div>
        <Button variant="accent" disabled>
          <Plus className="mr-2 h-4 w-4" />
          Create Invite
        </Button>
      </div>

      {/* Empty State */}
      <EmptyState />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        No invites yet
      </h2>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Create your first invite to give guests time-limited access to your
        property guides.
      </p>
      <Button variant="accent" size="lg" disabled>
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Invite
      </Button>
    </div>
  );
}
