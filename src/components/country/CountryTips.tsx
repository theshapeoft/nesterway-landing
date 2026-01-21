"use client";

import {
  CreditCard,
  Languages,
  Plug,
  Sun,
  Car,
  Phone,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryTip } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  "credit-card": <CreditCard className="h-5 w-5" />,
  languages: <Languages className="h-5 w-5" />,
  plug: <Plug className="h-5 w-5" />,
  sun: <Sun className="h-5 w-5" />,
  car: <Car className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

interface CountryTipsProps {
  tips: CountryTip[];
  className?: string;
}

export function CountryTips({ tips, className }: CountryTipsProps) {
  if (tips.length === 0) {
    return null;
  }

  return (
    <div className={cn("px-4 py-6", className)}>
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Practical Tips
        </h2>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-xl bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {iconMap[tip.icon] || <Info className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{tip.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {tip.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
