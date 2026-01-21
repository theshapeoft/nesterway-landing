"use client";

import { Sparkles, Heart, Bus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  vibe: string;
  bestFor: string[];
  gettingAround: string;
  className?: string;
}

export function QuickStats({
  vibe,
  bestFor,
  gettingAround,
  className,
}: QuickStatsProps) {
  return (
    <div className={cn("bg-card px-4 py-6 shadow-sm", className)}>
      <div className="mx-auto max-w-2xl space-y-4">
        {/* Vibe */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              The Vibe
            </p>
            <p className="text-foreground">{vibe}</p>
          </div>
        </div>

        {/* Best For */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Best For
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              {bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Getting Around */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Bus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Getting Around
            </p>
            <p className="text-foreground">{gettingAround}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
