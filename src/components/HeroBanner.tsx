import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-950 text-white mb-12 shadow-xl">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
        {/* Left Content */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring & Summer Collection 2025</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Elevate Your Everyday Style &amp; Performance
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl">
            Discover precision-engineered sportswear and lifestyle essentials. Designed for endurance, crafted for supreme comfort.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Shop All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products?category=shoes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              Explore Shoes
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
              <span className="font-semibold uppercase tracking-wider text-amber-400">Featured Drop</span>
              <p className="font-medium text-sm">Nike Air &amp; Adidas Pro Editions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
