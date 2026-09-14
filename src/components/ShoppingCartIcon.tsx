"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated, setHasHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasHydrated(true);
  }, [setHasHydrated]);

  const totalCount = mounted && hasHydrated
    ? cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 hover:text-gray-900 group"
      aria-label="Shopping Cart"
    >
      <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gray-900 text-white font-semibold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in-50 duration-200">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </Link>
  );
};

export default ShoppingCartIcon;
