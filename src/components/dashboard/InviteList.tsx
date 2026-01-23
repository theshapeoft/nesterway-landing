"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  MoreVertical,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  resendInviteEmail,
  deleteInvite,
  revokeInvite,
  type InviteWithProperty,
} from "@/lib/actions/invites";
import type { GuestInviteStatus } from "@/types";
import { cn } from "@/lib/utils";

interface InviteListProps {
  invites: InviteWithProperty[];
}

const statusConfig: Record<
  GuestInviteStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  revoked: {
    label: "Revoked",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateAccessWindow(invite: InviteWithProperty): {
  start: string;
  end: string;
} {
  const checkIn = new Date(invite.check_in_date);
  const checkOut = new Date(invite.check_out_date);

  const start = new Date(checkIn);
  start.setDate(start.getDate() - invite.lead_time_days);

  const end = new Date(checkOut);
  end.setDate(end.getDate() + invite.post_checkout_days);

  return {
    start: formatDate(start.toISOString()),
    end: formatDate(end.toISOString()),
  };
}

function InviteCard({ invite }: { invite: InviteWithProperty }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const status = statusConfig[invite.status];
  const accessWindow = calculateAccessWindow(invite);

  const handleResend = async () => {
    setIsLoading(true);
    setActionError(null);
    setShowMenu(false);

    const result = await resendInviteEmail(invite.id);

    if (!result.success) {
      setActionError(result.error || "Failed to resend email");
    }

    setIsLoading(false);
  };

  const handleRevoke = async () => {
    if (!confirm("Are you sure you want to revoke this invite?")) return;

    setIsLoading(true);
    setActionError(null);
    setShowMenu(false);

    const result = await revokeInvite(invite.id);

    if (!result.success) {
      setActionError(result.error || "Failed to revoke invite");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invite?")) return;

    setIsLoading(true);
    setActionError(null);
    setShowMenu(false);

    const result = await deleteInvite(invite.id);

    if (!result.success) {
      setActionError(result.error || "Failed to delete invite");
    }

    setIsLoading(false);
  };

  const isExpiredOrRevoked =
    invite.status === "expired" || invite.status === "revoked";

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-6",
        isExpiredOrRevoked && "opacity-60"
      )}
    >
      {actionError && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Guest Info */}
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "font-semibold text-foreground",
                isExpiredOrRevoked && "line-through"
              )}
            >
              {invite.guest_name}
            </h3>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.className)}>
              {status.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            <Mail className="mr-1 inline h-3 w-3" />
            {invite.guest_email}
          </p>

          {/* Property */}
          <p className="mt-2 text-sm text-foreground">
            {invite.property.name}
          </p>

          {/* Dates */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              <Calendar className="mr-1 inline h-3 w-3" />
              {formatDate(invite.check_in_date)} - {formatDate(invite.check_out_date)}
            </span>
            <span>
              <Clock className="mr-1 inline h-3 w-3" />
              Access: {accessWindow.start} to {accessWindow.end}
            </span>
          </div>

          {/* Access Code */}
          <p className="mt-2 font-mono text-sm text-foreground">
            Code: <span className="font-semibold">{invite.access_code}</span>
          </p>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-card py-1 shadow-lg">
                {!isExpiredOrRevoked && (
                  <>
                    <button
                      onClick={handleResend}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <Mail className="h-4 w-4" />
                      Resend Email
                      {invite.email_resend_count > 0 && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          ({invite.email_resend_count}/2)
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleRevoke}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <XCircle className="h-4 w-4" />
                      Revoke Access
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Invite
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function InviteList({ invites }: InviteListProps) {
  return (
    <div className="space-y-4">
      {invites.map((invite) => (
        <InviteCard key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
