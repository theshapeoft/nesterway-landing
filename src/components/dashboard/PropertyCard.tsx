"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  deleteProperty,
  duplicateProperty,
  type DbProperty,
} from "@/lib/actions/properties";

interface PropertyCardProps {
  property: DbProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updatedAt = new Date(property.updated_at);
  const now = new Date();
  const diffMs = now.getTime() - updatedAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeAgo: string;
  if (diffMins < 1) {
    timeAgo = "just now";
  } else if (diffMins < 60) {
    timeAgo = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  const areaDisplay = property.area_slug
    ? property.area_slug.charAt(0).toUpperCase() + property.area_slug.slice(1)
    : null;
  const countryDisplay = property.country_slug
    ? property.country_slug.charAt(0).toUpperCase() +
      property.country_slug.slice(1)
    : null;

  const handleDuplicate = () => {
    startTransition(async () => {
      await duplicateProperty(property.id);
    });
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${property.name}"? This action can be undone within 30 days.`
      )
    ) {
      startTransition(async () => {
        await deleteProperty(property.id);
      });
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{property.name}</h3>
          {areaDisplay && countryDisplay && (
            <p className="text-sm text-muted-foreground">
              {areaDisplay}, {countryDisplay}
            </p>
          )}
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowMenu(!showMenu)}
            disabled={isPending}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-card py-1 shadow-lg">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setShowMenu(false);
                    handleDuplicate();
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent"
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            property.status === "published" ? "bg-green-500" : "bg-amber-500"
          }`}
        />
        <span className="text-muted-foreground">
          {property.status === "published" ? "Published" : "Draft"}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">Updated {timeAgo}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/dashboard/properties/${property.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            <Pencil className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </Link>
        {property.status === "published" ? (
          <Link href={`/stay/${property.slug}`} target="_blank">
            <Button variant="ghost" size="sm">
              <ExternalLink className="mr-1 h-3 w-3" />
              View
            </Button>
          </Link>
        ) : (
          <Link href={`/stay/${property.slug}`} target="_blank">
            <Button variant="ghost" size="sm">
              Preview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
