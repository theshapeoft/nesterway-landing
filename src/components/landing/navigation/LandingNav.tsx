"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";

const navigationItems = [
  {
    label: "Features",
    items: [
      { label: "QR Access", href: "#features", description: "Instant guest access" },
      { label: "WiFi Sharing", href: "#features", description: "Auto-password sharing" },
      { label: "Local Guides", href: "#features", description: "Curated recommendations" },
      { label: "Offline Mode", href: "#features", description: "Works without internet" },
      { label: "All Features", href: "#features", description: "See complete list" }
    ]
  },
  {
    label: "Pricing",
    href: "#pricing"
  },
  {
    label: "Resources",
    items: [
      { label: "Blog", href: "#blog", description: "Tips and best practices" },
      { label: "Help Center", href: "/help", description: "Get support" },
      { label: "Demo Property", href: "/stay/demo-property", description: "Try it yourself" }
    ]
  }
];

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-sand-50/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <span className="text-white font-serif text-xl font-semibold">N</span>
              </div>
              <span className="font-serif text-2xl font-medium text-neutral-900 tracking-tight">
                Nesterway
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navigationItems.map((item, index) => (
                item.items ? (
                  <NavDropdown
                    key={index}
                    label={item.label}
                    items={item.items}
                  />
                ) : (
                  <Link
                    key={index}
                    href={item.href!}
                    className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors text-[15px]"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/login"
                className="text-neutral-600 hover:text-neutral-900 font-medium transition-colors text-[15px]"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-2.5 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition-colors text-[15px]"
              >
                Start free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </>
  );
}
