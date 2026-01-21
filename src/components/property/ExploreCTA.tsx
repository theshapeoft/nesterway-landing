"use client";

import Link from "next/link";
import { Compass, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ExploreCTAProps {
  areaName: string;
  href: string;
  className?: string;
}

export function ExploreCTA({ areaName, href, className }: ExploreCTAProps) {
  return (
    <div className={cn("px-4 pb-8", className)}>
      <div className="mx-auto max-w-2xl">
        <Link
          href={href}
          className="group flex items-center justify-between rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
              <Compass weight="fill" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">Explore {areaName}</p>
              <p className="text-sm text-primary-foreground/80">
                Discover what&apos;s nearby
              </p>
            </div>
          </div>
          <CaretRight weight="bold" className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
