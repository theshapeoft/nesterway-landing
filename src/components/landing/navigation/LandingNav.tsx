"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { CTAButton } from "../shared";
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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-ocean-600">
                Nesterway
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
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
                    className="text-gray-700 hover:text-ocean-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-ocean-600 font-medium transition-colors"
              >
                Login
              </Link>
              <CTAButton href="/signup" variant="primary" size="default">
                Start Free Trial
              </CTAButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:text-ocean-600"
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
