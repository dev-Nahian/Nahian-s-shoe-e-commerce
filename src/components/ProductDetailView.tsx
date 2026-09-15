"use client";

import { useProductStore } from "@/stores/productStore";
import { getProductById, getRelatedProducts } from "@/data/products";
import ProductDetails from "./ProductDetails";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";

export default function ProductDetailView({ id }: { id: string }) {
  const { getProductById: getFromStore, getRelatedProducts: getRelatedFromStore, products } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = mounted
    ? getFromStore(id) || getProductById(id)
    : getProductById(id);

  const related = mounted
    ? getRelatedFromStore(id, 4)
    : getRelatedProducts(id, 4);

  if (!product && !mounted) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          The product you are looking for might have been removed or does not exist.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-xs font-semibold hover:bg-gray-800 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>
      </div>
    );
  }

  return <ProductDetails product={product} relatedProducts={related} />;
}
