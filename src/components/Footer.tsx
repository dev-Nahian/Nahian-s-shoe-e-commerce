import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-950 text-gray-300 rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* BRAND & MISSION */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
              <Image
                width={36}
                height={36}
                src="/logo.png"
                alt="NAHIAN's logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              NAHIAN&apos;s
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
            Engineered for optimal comfort, peak athletic performance, and modern lifestyle aesthetics. Upgrade your everyday wardrobe today.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring & Summer 2025 Release Available</span>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
            Categories
          </h4>
          <Link href="/products?category=t-shirts" className="hover:text-white transition-colors">
            T-Shirts &amp; Tops
          </Link>
          <Link href="/products?category=shoes" className="hover:text-white transition-colors">
            Athletic Shoes
          </Link>
          <Link href="/products?category=jackets" className="hover:text-white transition-colors">
            Jackets &amp; Hoodies
          </Link>
          <Link href="/products?category=accessories" className="hover:text-white transition-colors">
            Accessories &amp; Denim
          </Link>
        </div>

        {/* CUSTOMER CARE */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
            Customer Care
          </h4>
          <Link href="/cart" className="hover:text-white transition-colors">
            Shopping Cart
          </Link>
          <Link href="/products" className="hover:text-white transition-colors">
            Track Order
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            My Account
          </Link>
          <Link href="/products" className="hover:text-white transition-colors">
            Returns &amp; Exchanges
          </Link>
        </div>

        {/* NEWSLETTER */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs">
            Newsletter
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Subscribe for 15% off your first order and exclusive drops.
          </p>
          <div className="flex gap-1.5 mt-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none border border-white/10 focus:border-white/30"
            />
            <button
              type="button"
              className="p-2 bg-white text-gray-950 rounded-xl hover:bg-amber-300 transition-colors shrink-0"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT & BOTTOM ROW */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} NAHIAN&apos;s Store. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/products" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/products" className="hover:text-gray-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/products" className="hover:text-gray-400 transition-colors">
            Cookie Preferences
          </Link>
        </div>
      </div>
    </footer>
  );
};
