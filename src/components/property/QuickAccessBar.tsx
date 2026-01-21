"use client";

import { WifiHigh, Clock, Phone, Compass } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickAccessItem {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "primary" | "emergency";
}

interface QuickAccessBarProps {
  checkoutTime: string;
  onWifiClick: () => void;
  onEmergencyClick: () => void;
  exploreHref: string;
  areaName: string;
  className?: string;
}

function QuickAccessPill({
  icon,
  label,
  sublabel,
  onClick,
  href,
  variant = "default",
}: QuickAccessItem) {
  const baseClasses = cn(
    "flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl transition-all duration-200",
    "min-w-[72px] touch-target",
    "active:scale-95",
    variant === "default" && "bg-white shadow-md shadow-neutral-900/5 hover:shadow-lg hover:shadow-neutral-900/10",
    variant === "primary" && "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90",
    variant === "emergency" && "bg-white shadow-md shadow-neutral-900/5 hover:shadow-lg"
  );

  const content = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          variant === "default" && "bg-sand-100 text-neutral-700",
          variant === "primary" && "bg-primary-foreground/10 text-primary-foreground",
          variant === "emergency" && "bg-coral-500/10 text-coral-600"
        )}
      >
        {icon}
      </span>
      <div className="text-center">
        <span
          className={cn(
            "block text-xs font-semibold",
            variant === "default" && "text-neutral-800",
            variant === "primary" && "text-primary-foreground",
            variant === "emergency" && "text-neutral-800"
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className={cn(
              "block text-[10px]",
              variant === "default" && "text-neutral-500",
              variant === "primary" && "text-primary-foreground/70",
              variant === "emergency" && "text-neutral-500"
            )}
          >
            {sublabel}
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}

export function QuickAccessBar({
  checkoutTime,
  onWifiClick,
  onEmergencyClick,
  exploreHref,
  areaName,
  className,
}: QuickAccessBarProps) {
  const items: QuickAccessItem[] = [
    {
      icon: <WifiHigh weight="bold" className="h-5 w-5" />,
      label: "Wi-Fi",
      sublabel: "Connect",
      onClick: onWifiClick,
      variant: "default",
    },
    {
      icon: <Clock weight="bold" className="h-5 w-5" />,
      label: checkoutTime,
      sublabel: "Checkout",
      variant: "default",
    },
    {
      icon: <Phone weight="bold" className="h-5 w-5" />,
      label: "Help",
      sublabel: "Emergency",
      onClick: onEmergencyClick,
      variant: "emergency",
    },
    {
      icon: <Compass weight="bold" className="h-5 w-5" />,
      label: "Explore",
      sublabel: areaName,
      href: exploreHref,
      variant: "primary",
    },
  ];

  return (
    <div className={cn("px-4 -mt-10 relative z-20", className)}>
      <div className="mx-auto max-w-lg">
        {/* Floating card container */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex items-stretch gap-3 pb-1">
            {items.map((item, index) => (
              <QuickAccessPill
                key={index}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
