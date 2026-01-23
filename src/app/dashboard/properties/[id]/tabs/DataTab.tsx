"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import {
  Download,
  Users,
  Search,
  ArrowUpDown,
  Trash2,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

interface GuestRegistration {
  id: string;
  property_id: string;
  full_name: string;
  email: string;
  additional_guests: number;
  registered_at: string;
  ip_address: string | null;
}

interface DataTabProps {
  propertyId: string;
  propertySlug: string;
  requireGuestRegistration: boolean;
  onDataChange?: () => void;
}

type SortField = "registered_at" | "full_name" | "email";
type SortDirection = "asc" | "desc";

export function DataTab({
  propertyId,
  propertySlug,
  requireGuestRegistration,
  onDataChange,
}: DataTabProps) {
  const [registrations, setRegistrations] = useState<GuestRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("registered_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("guest_registrations")
      .select("*")
      .eq("property_id", propertyId)
      .order("registered_at", { ascending: false });

    if (error) {
      console.error("Error fetching registrations:", error);
    } else if (data) {
      setRegistrations(data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    const supabase = createClient();
    startTransition(async () => {
      const { error } = await supabase
        .from("guest_registrations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting registration:", error);
      } else {
        await fetchRegistrations();
        onDataChange?.();
      }
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter and sort registrations
  const filteredRegistrations = registrations
    .filter((reg) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        reg.full_name.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "registered_at") {
        comparison =
          new Date(a.registered_at).getTime() -
          new Date(b.registered_at).getTime();
      } else if (sortField === "full_name") {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortField === "email") {
        comparison = a.email.localeCompare(b.email);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportToCSV = () => {
    const headers = [
      "Full Name",
      "Email",
      "Additional Guests",
      "Registration Date",
      "IP Address",
    ];
    const rows = registrations.map((reg) => [
      reg.full_name,
      reg.email,
      reg.additional_guests.toString(),
      new Date(reg.registered_at).toISOString(),
      reg.ip_address || "",
    ]);

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const date = new Date().toISOString().split("T")[0];
    const filename = `${propertySlug}-registrations-${date}.csv`;

    downloadBlob(blob, filename);
    track("data_exported_csv", { property_id: propertyId, count: registrations.length });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium">Guest Registrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View and export guest registration data collected from your property.
        </p>
      </div>

      {/* Registration Status */}
      {!requireGuestRegistration && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Guest registration is disabled</p>
            <p className="mt-1 text-sm opacity-90">
              Enable &quot;Require Guest Registration&quot; in Basic Info to
              collect guest contact information.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {registrations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No guest registrations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {requireGuestRegistration
              ? "Registrations will appear here when guests visit your property page."
              : "Enable forced registration in property settings to start collecting guest data."}
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Export Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={exportToCSV}
              disabled={registrations.length === 0}
            >
              <Download className="mr-1 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground">
            Guest data stored securely. Export and use data in compliance with
            privacy laws.
          </p>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      onClick={() => handleSort("full_name")}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      onClick={() => handleSort("email")}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Email
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                    Additional Guests
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    <button
                      onClick={() => handleSort("registered_at")}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Registration Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{reg.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {reg.email}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {reg.additional_guests}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(reg.registered_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(reg.id)}
                        disabled={isPending}
                        title="Delete registration (GDPR compliance)"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Results */}
            {filteredRegistrations.length === 0 && searchQuery && (
              <div className="p-8 text-center text-muted-foreground">
                No registrations match &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length} of {registrations.length}{" "}
            registration{registrations.length !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </div>
  );
}
