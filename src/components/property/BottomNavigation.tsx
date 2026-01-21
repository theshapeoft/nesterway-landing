"use client";

import { House, Info, MapPin, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type NavTab = "home" | "info" | "map" | "search";

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

const navItems: { id: NavTab; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "info", label: "Info", icon: Info },
  { id: "map", label: "Map", icon: MapPin },
  { id: "search", label: "Search", icon: MagnifyingGlass },
];

export function BottomNavigation({
  activeTab,
  onTabChange,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-neutral-900/95 backdrop-blur-lg",
        "border-t border-white/5",
        "pb-safe", // Safe area for notched phones
        className
      )}
    >
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all duration-200",
                  "min-w-[64px] touch-target",
                  isActive
                    ? "text-primary"
                    : "text-white/50 hover:text-white/70 active:scale-95"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary animate-fade-in" />
                )}

                <Icon
                  weight={isActive ? "fill" : "regular"}
                  className={cn(
                    "h-6 w-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium uppercase tracking-wider transition-colors",
                    isActive ? "text-primary" : "text-white/50"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export type { NavTab };
