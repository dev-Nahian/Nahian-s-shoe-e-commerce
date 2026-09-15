"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useContentStore } from "@/stores/contentStore";
import { useEffect, useState } from "react";

const HeroBanner = () => {
  const { hero, promo } = useContentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeText = mounted ? hero.badge : "Spring & Summer Collection 2026";
  const titleText = mounted ? hero.title : "Elevate Your Everyday Style & Performance";
  const highlightText = mounted ? hero.highlightText : "Peak Endurance.";
  const descText = mounted
    ? hero.description
    : "Discover precision-engineered sportswear and lifestyle essentials. Designed for endurance, crafted for supreme comfort.";
  const primaryText = mounted ? hero.primaryButtonText : "Shop All Products";
  const primaryLink = mounted ? hero.primaryButtonLink : "/products";
  const secondaryText = mounted ? hero.secondaryButtonText : "Explore Shoes";
  const secondaryLink = mounted ? hero.secondaryButtonLink : "/products?category=shoes";
  const discountBadge = mounted ? hero.discountBadge : "Up to 40% Off New Arrivals";

  return (
    <div className="flex flex-col gap-4 mb-12">
      {/* Dynamic Announcement Bar if enabled */}
      {mounted && promo.enabled && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs sm:text-sm font-semibold text-center">
          <span>{promo.message}</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-gray-950 font-bold font-mono text-xs">
            {promo.promoCode}
          </span>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-950 text-white shadow-xl">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {titleText}{" "}
              <span className="bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                {highlightText}
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-xl">{descText}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={primaryLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <span>{primaryText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={secondaryLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
              >
                <span>{secondaryText}</span>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden group">
            <Image
              src="/featured.png"
              alt="Featured Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-xs text-white/90">
                <span className="font-semibold uppercase tracking-wider text-amber-400">
                  Featured Drop
                </span>
                <p className="font-medium text-sm">{discountBadge}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
