"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Compass,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
  Mail,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { track, resetUser } from "@/lib/analytics";

const navItems = [
  { href: "/dashboard", label: "Guides", icon: Home },
  { href: "/dashboard/invites", label: "Invites", icon: Mail },
  { href: "/dashboard/help", label: "Help Center", icon: HelpCircle },
] as const;

interface DashboardHeaderProps {
  user: SupabaseUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  const isActiveNav = (href: string) => {
    if (href === "/dashboard") {
      // "Guides" is active for /dashboard, /dashboard/properties/*
      return (
        pathname === "/dashboard" || pathname.startsWith("/dashboard/properties")
      );
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    track("logout", {});
    resetUser();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">
            Travelama
          </span>
        </Link>

        {/* Main Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveNav(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden sm:block text-foreground">{userName}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/dashboard/account"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>

                <hr className="my-1 border-border" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
