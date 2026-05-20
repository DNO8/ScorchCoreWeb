"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { ConnectWallet } from "@/components/wallet";
import { useWallet } from "@/lib/hooks/user/useWallet";
import { PUBLIC_NAV_ITEMS } from "@/lib/constants/routes";

export const Header: React.FC = () => {
  const { isConnected } = useWallet();
  const pathname = usePathname();
  const homeUrl = isConnected ? "/dashboard" : "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const appLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/forge", label: "Forge", icon: "🔥" },
    { href: "/inventory", label: "Inventory", icon: "📦" },
    { href: "/staking", label: "Mining", icon: "⛏️" },
    { href: "/analytics", label: "Analytics", icon: "📊" },
    { href: "/collection", label: "Collections", icon: "🏆" },
    { href: "/trustscore", label: "TrustScore", icon: "🎯" },
    { href: "/economy", label: "Economy", icon: "💰" },
    { href: "/vesting", label: "Vesting", icon: "🔒" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-backdrop-filter:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={homeUrl} className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">🔥</span>
          </div>
          <div className="flex flex-col">
            <span className="alchemy-heading text-xl">ScorchCore</span>
            <span className="alchemy-copy text-ethereal-cyan text-xs opacity-70">
              Protocol
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Public Links - always visible */}
          {PUBLIC_NAV_ITEMS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "primary" : "ghost"}
                size="sm"
                className="text-sm"
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Button>
            </Link>
          ))}

          {/* App Links - only when connected */}
          {isConnected && (
            <>
              <div className="mx-2 h-6 w-px bg-gray-700" />
              {appLinks.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={pathname === link.href ? "primary" : "ghost"}
                    size="sm"
                    className="text-sm"
                  >
                    <span className="mr-1">{link.icon}</span>
                    {link.label}
                  </Button>
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-sm"
                >
                  More
                  <ChevronDown
                    className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {isDropdownOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      {appLinks.slice(4).map((link, idx) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-800 transition-colors ${
                            pathname === link.href
                              ? "text-orange-400 bg-gray-800/50"
                              : "text-gray-300"
                          } ${idx === 0 ? "rounded-t-lg" : ""} ${
                            idx === appLinks.slice(4).length - 1
                              ? "rounded-b-lg"
                              : "border-b border-gray-800"
                          }`}
                        >
                          <span>{link.icon}</span>
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Right side: Wallet + Mobile toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button - always visible */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - always available */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 bg-black">
          <nav className="container mx-auto px-4 py-4">
            {/* Public Links */}
            <div className="space-y-1">
              <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Learn
              </p>
              {PUBLIC_NAV_ITEMS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* App Links - only when connected */}
            {isConnected && (
              <div className="mt-4 pt-4 border-t border-gray-800 space-y-1">
                <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  App
                </p>
                {appLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === link.href
                        ? "bg-orange-500/10 text-orange-400"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Wallet */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <ConnectWallet />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
