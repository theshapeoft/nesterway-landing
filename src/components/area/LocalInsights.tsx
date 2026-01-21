"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalInsightsProps {
  insights: string[];
  className?: string;
}

export function LocalInsights({ insights, className }: LocalInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <div className={cn("px-4 py-6", className)}>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-primary/10 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Local Insights</h2>
          </div>

          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <p className="text-sm text-foreground">{insight}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
