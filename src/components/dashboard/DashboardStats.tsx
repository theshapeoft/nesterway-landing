import Link from "next/link";
import { Ticket, Home, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  propertyCount: number;
  inviteCount: number;
  className?: string;
}

export function DashboardStats({
  propertyCount,
  inviteCount,
  className,
}: DashboardStatsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {/* Properties Count */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {propertyCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {propertyCount === 1 ? "Property" : "Properties"}
            </p>
          </div>
        </div>
      </div>

      {/* Invites Created */}
      <Link
        href="/dashboard/invites"
        className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-card/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
            <Ticket className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {inviteCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {inviteCount === 1 ? "Invite Created" : "Invites Created"}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </Link>
    </div>
  );
}
