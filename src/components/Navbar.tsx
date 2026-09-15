"use client";

import Image from "next/image";
import Link from "next/link";
import { Searchbar } from "./Searchbar";
import { User, Menu, X, ShieldCheck } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import ThemeToggle from "./ThemeToggle";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/products?category=t-shirts", label: "T-Shirts" },
    { href: "/products?category=shoes", label: "Shoes" },
    { href: "/products?category=jackets", label: "Jackets" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80 transition-all mb-8">
      <nav className="w-full flex items-center justify-between py-4">
        {/* LEFT BRAND */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-lg bg-gray-900 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <Image
                width={36}
                height={36}
                src="/logo.png"
                alt="NAHIAN's Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
              NAHIAN&apos;s
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-gray-900 dark:hover:text-white ${
                  pathname === link.href ? "text-gray-900 dark:text-amber-400 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Suspense fallback={<div className="w-28 sm:w-44 h-8 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />}>
            <Searchbar />
          </Suspense>

          <ShoppingCartIcon />

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Admin Dashboard Quick Link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gray-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-all"
            title="Open Store Admin Dashboard"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-800"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU ACCORDION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 py-4 px-2 flex flex-col gap-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-b-xl shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-gray-900 text-white dark:bg-amber-400 dark:text-gray-950 font-bold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center px-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Free shipping on all orders over $50</span>
            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="underline text-gray-800 dark:text-gray-200">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
