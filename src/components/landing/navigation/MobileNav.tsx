"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CTAButton } from "../shared";

interface NavigationItem {
  label: string;
  href?: string;
  items?: Array<{ label: string; href: string; description?: string }>;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
}

export function MobileNav({ isOpen, onClose, navigationItems }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="text-2xl font-bold text-ocean-600">
              Nesterway
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-4">
              {navigationItems.map((item, index) => (
                <div key={index}>
                  {item.items ? (
                    <>
                      <button
                        onClick={() => toggleItem(item.label)}
                        className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-2"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 transition-transform",
                            expandedItems.has(item.label) && "rotate-180"
                          )}
                        />
                      </button>
                      {expandedItems.has(item.label) && (
                        <div className="pl-4 mt-2 space-y-2">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              onClick={onClose}
                              className="block py-2 text-gray-600 hover:text-ocean-600"
                            >
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-sm text-muted-foreground">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={onClose}
                      className="block font-medium text-gray-900 py-2 hover:text-ocean-600"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer CTAs */}
          <div className="p-6 border-t space-y-3">
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center py-3 font-medium text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <CTAButton href="/signup" variant="primary" size="lg" className="w-full">
              Start Free Trial
            </CTAButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
