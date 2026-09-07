"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Monitor, LayoutDashboard, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/logo";
import { Button } from "@/components/atoms/button";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

const themeOptions = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
];

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#markets", label: "Markets" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border-primary bg-bg-primary/90 backdrop-blur-md shadow-sm"
          : "border-b border-border-primary/50 bg-bg-primary/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="TradeX Home">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isAbout = link.href === "/about";
            const isActive = isAbout && pathname === "/about";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand",
                  isActive ? "text-brand font-semibold" : "text-text-secondary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side: Theme & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center rounded-lg border border-border-primary bg-bg-secondary p-0.5">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  theme === opt.value ? "bg-brand text-white" : "text-text-tertiary hover:text-text-primary",
                )}
                title={opt.label}
                aria-label={`Switch to ${opt.label} mode`}
              >
                <opt.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button size="sm" variant="primary" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-primary bg-bg-secondary text-text-secondary transition-colors hover:border-brand hover:text-brand"
                  title="Profile"
                  aria-label="User Profile"
                >
                  <User className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary" className="gap-1.5">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg border border-border-primary p-2 text-text-secondary hover:bg-bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-border-primary p-2 text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border-primary bg-bg-primary px-4 py-6 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-brand transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border-primary pt-4 space-y-3">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center gap-2" variant="primary">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center gap-2" variant="secondary">
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center" variant="secondary">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center" variant="primary">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
