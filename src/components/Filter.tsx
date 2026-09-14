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
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 my-6 pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
          Showing All Results
        </span>
      </div>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
          <select
            name="sort"
            id="sort"
            value={currentSort}
            className="bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-xs cursor-pointer"
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
