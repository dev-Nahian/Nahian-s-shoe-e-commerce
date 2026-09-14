"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartItemsType, ShippingFormInputs } from "@/types";

interface OrderSuccessModalProps {
  orderId: string;
  items: CartItemsType;
  total: number;
  shipping: ShippingFormInputs;
  onClose: () => void;
}

const OrderSuccessModal = ({
  orderId,
  items,
  total,
  shipping,
  onClose,
}: OrderSuccessModalProps) => {
  useEffect(() => {
    // Launch fireworks confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 360,
        startVelocity: 30,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* SUCCESS ICON HEADER */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
            Thank you for shopping with NAHIAN&apos;s! A confirmation receipt has been sent to{" "}
            <strong className="text-gray-900">{shipping.email}</strong>.
          </p>
        </div>

        {/* ORDER SUMMARY BOX */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <div>
              <span className="text-gray-400 font-medium">Order Number</span>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{orderId}</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-medium">Estimated Delivery</span>
              <p className="font-semibold text-emerald-600 text-sm mt-0.5">3-5 Business Days</p>
            </div>
          </div>

          {/* Purchased Items Preview */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-gray-700">Purchased Items ({items.length})</span>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                      <Image
                        src={item.images[item.selectedColor] || Object.values(item.images)[0]}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">
                        Qty: {item.quantity} | Size: {item.selectedSize} | {item.selectedColor}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping destination */}
          <div className="pt-3 border-t border-gray-200 flex justify-between items-start">
            <div>
              <span className="text-gray-400 font-medium">Ship to:</span>
              <p className="font-semibold text-gray-800">
                {shipping.name}, {shipping.address}, {shipping.city}, {shipping.postalCode}
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 font-medium">Total Paid:</span>
              <p className="font-extrabold text-gray-900 text-base">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-all text-center"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/products"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all text-center shadow-md"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
