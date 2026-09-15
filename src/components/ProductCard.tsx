"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { ShoppingBag, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || Object.keys(product.images)[0]);
  const [isHovered, setIsHovered] = useState(false);

  const { addToCart } = useCartStore();
  const { success } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor,
    });
    success(`Added ${product.name} (${selectedSize.toUpperCase()}, ${selectedColor}) to cart!`);
  };

  const currentImage = product.images[selectedColor] || Object.values(product.images)[0] || "/featured.png";
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-xl dark:hover:border-gray-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-4/5 bg-gray-50/80 dark:bg-gray-950/60 overflow-hidden">
        <Link href={`/products/${product.id}`} className="relative block w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 bg-gray-900 dark:bg-amber-400 text-white dark:text-gray-950 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <Link
          href={`/products/${product.id}`}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-gray-900 dark:text-white border border-transparent dark:border-gray-700 text-xs font-semibold rounded-full shadow-md flex items-center gap-1.5 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </Link>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{product.rating || 4.8}</span>
            <span className="text-gray-400 text-[11px]">({product.reviewsCount || 45})</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1 hover:text-amber-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* CONTROLS (Size & Color) */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 text-xs">
          {/* Color Switcher */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Select ${color}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    isSelected
                      ? "ring-2 ring-gray-900 dark:ring-white ring-offset-1 dark:ring-offset-gray-900 scale-115"
                      : "border-gray-300 dark:border-gray-600 opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      color === "white"
                        ? "#f8fafc"
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
                />
              );
            })}
          </div>

          {/* Size Selector */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-medium rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white cursor-pointer"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE & ADD TO CART */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-950 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;