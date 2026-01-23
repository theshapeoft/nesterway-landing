"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { CreateInviteForm, InviteList } from "@/components/dashboard";
import type { InviteWithProperty } from "@/lib/actions/invites";
import { EmptyState } from "./page";

interface Property {
  id: string;
  name: string;
}

interface InvitesPageClientProps {
  properties: Property[];
  invites: InviteWithProperty[];
  hasProperties: boolean;
}

export function InvitesPageClient({
  properties,
  invites,
  hasProperties,
}: InvitesPageClientProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSuccess = () => {
    // Form will close itself, page will revalidate via server action
  };

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
        <Button
          variant="accent"
          onClick={() => setShowCreateForm(true)}
          disabled={!hasProperties}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Invite
        </Button>
      </div>

      {/* Content */}
      {invites.length === 0 ? (
        <EmptyState
          hasProperties={hasProperties}
          onCreateClick={() => setShowCreateForm(true)}
        />
      ) : (
        <InviteList invites={invites} />
      )}

      {/* Create Invite Form */}
      {hasProperties && (
        <CreateInviteForm
          properties={properties}
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
