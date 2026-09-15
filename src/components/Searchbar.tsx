"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const Searchbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 px-3 py-1.5 focus-within:border-gray-900 dark:focus-within:border-gray-600 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all shadow-xs"
    >
      <button type="submit" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" aria-label="Search">
        <Search className="w-4 h-4" />
      </button>
      <input
        id="search"
        placeholder="Search products..."
        className="text-xs sm:text-sm bg-transparent outline-none w-28 sm:w-44 md:w-56 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};
