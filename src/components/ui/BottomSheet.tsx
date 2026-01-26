"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className,
}: BottomSheetProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
        className={cn(
          "absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-card animate-slide-up",
          className
        )}
      >
        {/* Handle */}
        <div className="sticky top-0 z-10 flex items-center justify-center bg-card pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header with close button */}
        <div className="relative px-6 pb-4">
          {title && (
            <h2
              id="bottom-sheet-title"
              className="text-center text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="touch-target absolute right-4 top-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">{children}</div>
      </div>
    </div>
  );
}
