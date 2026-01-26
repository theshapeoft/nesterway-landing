"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center space-x-1 text-gray-700 hover:text-ocean-600 font-medium transition-colors"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-3 hover:bg-ocean-50 transition-colors"
            >
              <div className="font-medium text-gray-900">{item.label}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
