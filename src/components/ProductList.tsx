import { products } from "@/data/products";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Suspense } from "react";

interface ProductListProps {
  category?: string;
  search?: string;
  sort?: string;
  params: "homepage" | "products";
}

const ProductList = ({ category, search, sort, params }: ProductListProps) => {
  // 1. Filter by category
  let filtered = [...products];
  if (category && category !== "all") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 2. Filter by search query
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // 3. Sort products
  if (sort === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "oldest") {
    filtered.sort((a, b) => Number(a.id) - Number(b.id));
  } else {
    // "newest" by default
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  }

  const displayProducts = params === "homepage" && !category && !search
    ? filtered.slice(0, 6)
    : filtered;

  return (
    <div className="w-full">
      {/* Category selector */}
      <Suspense fallback={<div className="h-10 bg-gray-100 rounded-full animate-pulse my-6" />}>
        <Categories />
      </Suspense>

      {/* Filter / Sort bar on /products page */}
      {params === "products" && (
        <Suspense fallback={<div className="h-8 bg-gray-100 rounded-lg animate-pulse my-6" />}>
          <Filter />
        </Suspense>
      )}

      {/* Product count header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {category && category !== "all"
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`
              : search
              ? `Search Results for "${search}"`
              : params === "homepage"
              ? "Trending Products"
              : "All Products"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing {displayProducts.length} {displayProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        {params === "homepage" && (
          <Link
            href={category ? `/products?category=${category}` : "/products"}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-400 mb-4">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search term.
          </p>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-all shadow-xs"
          >
            Clear All Filters
          </Link>
        </div>
      )}

      {params === "homepage" && (
        <div className="flex justify-center mt-10">
          <Link
            href={category ? `/products?category=${category}` : "/products"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-md"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
