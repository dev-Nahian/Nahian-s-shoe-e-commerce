"use client";

import { ProductType } from "@/types";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import { useToast } from "@/context/ToastContext";
import ProductCard from "./ProductCard";
import {
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Check,
} from "lucide-react";

interface ProductDetailsProps {
  product: ProductType;
  relatedProducts: ProductType[];
}

const ProductDetails = ({ product, relatedProducts }: ProductDetailsProps) => {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { success } = useToast();

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || Object.keys(product.images)[0]
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const currentImage =
    product.images[selectedColor] ||
    Object.values(product.images)[0] ||
    "/featured.png";

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    success(
      `Added ${quantity}x ${product.name} (${selectedSize.toUpperCase()}, ${selectedColor}) to cart!`
    );
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/products?category=${product.category}`}
          className="capitalize hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* MAIN PRODUCT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        {/* LEFT: GALLERY */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-128 pb-2 sm:pb-0 scrollbar-none">
            {product.colors.map((color) => {
              const img = product.images[color];
              if (!img) return null;
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border-2 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "border-gray-900 dark:border-white ring-2 ring-gray-900/20 dark:ring-white/20"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} in ${color}`}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </button>
              );
            })}
          </div>

          {/* Main Image Container */}
          <div className="relative aspect-square flex-1 bg-gray-50/80 dark:bg-gray-900/60 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner group">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-800 dark:text-gray-200 font-semibold text-xs rounded-full border border-gray-200 dark:border-gray-700">
              Color: <strong className="capitalize text-amber-500">{selectedColor}</strong>
            </span>
          </div>
        </div>

        {/* RIGHT: DETAILS & ACTIONS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 text-xs font-bold tracking-wider uppercase mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">
                  {product.rating || 4.8}
                </span>
                <span className="text-gray-400 text-xs">
                  ({product.reviewsCount || 89} reviews)
                </span>
              </div>

              <span className="text-gray-300 dark:text-gray-700">•</span>

              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>In Stock &amp; Ready to Ship</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.shortDescription}
          </p>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Color Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Color: <span className="font-bold capitalize text-gray-900 dark:text-white">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-gray-900 dark:ring-white ring-offset-2 dark:ring-offset-gray-900 scale-110"
                        : "border-gray-200 dark:border-gray-700 hover:scale-105"
                    }`}
                    style={{
                      backgroundColor:
                        color === "white"
                          ? "#ffffff"
                          : color === "black"
                          ? "#1e293b"
                          : color === "gray"
                          ? "#94a3b8"
                          : color === "pink"
                          ? "#f472b6"
                          : color === "blue"
                          ? "#3b82f6"
                          : color === "green"
                          ? "#22c55e"
                          : color === "purple"
                          ? "#a855f7"
                          : color === "orange"
                          ? "#f97316"
                          : color === "red"
                          ? "#ef4444"
                          : color,
                    }}
                    title={color}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          color === "white" || color === "pink"
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Select Size</span>
              <span className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                Size Guide
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gray-900 text-white dark:bg-amber-400 dark:text-gray-950 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl p-1 bg-gray-50 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-800 dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-950 text-white text-sm font-bold shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-gray-950 text-sm font-extrabold shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-gray-950" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50/70 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl text-[11px] text-gray-600 dark:text-gray-400 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-gray-200 dark:border-gray-700">
              <RotateCcw className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS: Description, Specs, Reviews */}
      <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-8">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "desc"
                ? "border-gray-900 dark:border-amber-400 text-gray-900 dark:text-amber-400 font-bold"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "specs"
                ? "border-gray-900 dark:border-amber-400 text-gray-900 dark:text-amber-400 font-bold"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Specifications &amp; Care
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "border-gray-900 dark:border-amber-400 text-gray-900 dark:text-amber-400 font-bold"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Customer Reviews ({product.reviewsCount || 89})
          </button>
        </div>

        <div className="py-6">
          {activeTab === "desc" && (
            <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <p>
                Engineered specifically for peak athletic demands as well as casual everyday styling.
                The lightweight fabric ensures optimal airflow, keeping you fresh throughout your daily routine.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-gray-700 dark:text-gray-300">
                <li>Athletic tailored fit for unrestricted performance</li>
                <li>Reinforced high-stress seams for extra longevity</li>
                <li>Colorfast reactive dye technology resists fading</li>
                <li>Imported premium grade fibers</li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm max-w-2xl">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 uppercase font-semibold">Material</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">88% Recycled Poly, 12% Elastane</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 uppercase font-semibold">Fit</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">Standard athletic fit</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 uppercase font-semibold">Care Instructions</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">Machine wash cold, tumble dry low</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-400 uppercase font-semibold">Country of Origin</span>
                <p className="font-medium text-gray-800 dark:text-gray-200 mt-0.5">Designed in US, Ethical Production</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Review 1 */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Marcus Vance</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-semibold">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  &quot;Absolutely exceeded my expectations! The fit is true to size and the material feels extremely luxurious and soft on the skin.&quot;
                </p>
              </div>

              {/* Review 2 */}
              <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Sarah Jenkins</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-semibold">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">1 week ago</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < 4 ? "fill-amber-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  &quot;Fast shipping, great color fidelity matching the photos. Definitely ordering another one in a different colorway!&quot;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              You Might Also Like
            </h2>
            <Link
              href="/products"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
