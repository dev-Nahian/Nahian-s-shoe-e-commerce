"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, RotateCcw } from "lucide-react";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSort = searchParams.get("sort") || "newest";
  const hasFilters = searchParams.has("category") || searchParams.has("sort") || searchParams.has("search");

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400 my-6 pb-2 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
          Showing Catalog Results
        </span>
      </div>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">Sort by:</span>
          <select
            name="sort"
            id="sort"
            value={currentSort}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white shadow-xs cursor-pointer"
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="oldest">Oldest</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;
