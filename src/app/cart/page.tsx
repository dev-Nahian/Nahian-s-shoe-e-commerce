"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import { useToast } from "@/context/ToastContext";
import { ShippingFormInputs, PaymentFormInputs } from "@/types";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import OrderSuccessModal from "@/components/OrderSuccessModal";
import {
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Check,
} from "lucide-react";

import { useOrderStore } from "@/stores/orderStore";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

function CartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, hasHydrated, setHasHydrated } =
    useCartStore();
  const { addOrder } = useOrderStore();
  const { success, info } = useToast();

  const [mounted, setMounted] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormInputs | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    items: typeof cart;
    total: number;
    shipping: ShippingFormInputs;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setHasHydrated(true);
  }, [setHasHydrated]);

  const activeStep = parseInt(searchParams.get("step") || "1");

  const setStep = (stepNumber: number) => {
    router.push(`/cart?step=${stepNumber}`, { scroll: false });
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 50 || cart.length === 0 ? 0 : 10;
  const total = Math.max(0, subtotal - discountAmount + (cart.length > 0 ? shippingFee : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "SAVE10" || code === "DISCOUNT10" || code === "NAHIAN10") {
      setDiscountPercent(10);
      setPromoApplied(true);
      success("10% discount promo code applied!");
    } else if (code === "VIP20") {
      setDiscountPercent(20);
      setPromoApplied(true);
      success("20% VIP discount promo code applied!");
    } else {
      setPromoError("Invalid code. Try 'SAVE10' or 'VIP20'");
    }
  };

  const handleShippingSubmit = (data: ShippingFormInputs) => {
    setShippingData(data);
    setStep(3);
  };

  const handlePaymentSubmit = (data: PaymentFormInputs) => {
    if (!shippingData) {
      setStep(2);
      return;
    }

    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
      const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      // Save order to store
      addOrder({
        orderNumber: orderId,
        items: [...cart],
        total,
        subtotal,
        shippingFee,
        discount: discountAmount,
        shipping: shippingData,
        paymentMethod: data.paymentMethod,
        status: "processing",
      });

      setCompletedOrder({
        orderId,
        items: [...cart],
        total,
        shipping: shippingData,
      });
      info(`Payment processed via ${data.paymentMethod.toUpperCase()}`);
      clearCart();
    }, 1200);
  };

  if (!mounted || !hasHydrated) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // EMPTY CART STATE (if step 1 and cart is empty and not completing order)
  if (cart.length === 0 && !completedOrder && activeStep === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-8">
          Looks like you haven&apos;t added any items to your shopping cart yet.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-6">
      {/* SUCCESS MODAL */}
      {completedOrder && (
        <OrderSuccessModal
          orderId={completedOrder.orderId}
          items={completedOrder.items}
          total={completedOrder.total}
          shipping={completedOrder.shipping}
          onClose={() => {
            setCompletedOrder(null);
            router.push("/");
          }}
        />
      )}

      {/* HEADER TITLE */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {activeStep === 1
            ? "Your Shopping Cart"
            : activeStep === 2
            ? "Shipping Address"
            : "Review & Payment"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete your order in 3 simple, secure steps
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="flex items-center justify-center w-full max-w-2xl px-4">
        {steps.map((step, idx) => {
          const isCurrent = step.id === activeStep;
          const isPassed = step.id < activeStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => {
                  if (isPassed || (step.id === 2 && cart.length > 0)) {
                    setStep(step.id);
                  }
                }}
                disabled={step.id > activeStep && !shippingData}
                className="flex items-center gap-2 text-left group cursor-pointer disabled:cursor-not-allowed"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPassed
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-gray-900 text-white ring-4 ring-gray-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold hidden md:inline transition-colors ${
                    isCurrent
                      ? "text-gray-900"
                      : isPassed
                      ? "text-emerald-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
                    isPassed ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* MAIN CHECKOUT CONTAINER */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        {/* LEFT COLUMN: ACTIVE STEP CONTENT */}
        <div className="w-full lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
          {/* STEP 1: CART ITEMS */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-base">
                  Cart Items ({cart.reduce((acc, i) => acc + i.quantity, 0)})
                </h3>
                <button
                  onClick={() => {
                    clearCart();
                    info("Cart cleared");
                  }}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="flex flex-col gap-4 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="pt-4 first:pt-0 flex items-center justify-between gap-4"
                  >
                    {/* Item Image + Details */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <Image
                          src={
                            item.images[item.selectedColor] ||
                            Object.values(item.images)[0] ||
                            "/featured.png"
                          }
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/products/${item.id}`}
                          className="font-semibold text-sm sm:text-base text-gray-900 hover:text-amber-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="capitalize">
                            Color: <strong>{item.selectedColor}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Size: <strong>{item.selectedSize.toUpperCase()}</strong>
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 mt-1">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls & Delete */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="p-1.5 hover:bg-white rounded-md text-gray-600 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="p-1.5 hover:bg-white rounded-md text-gray-600 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeFromCart(item);
                          info(`Removed ${item.name} from cart`);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING FORM */}
          {activeStep === 2 && (
            <ShippingForm
              initialData={shippingData || undefined}
              onSubmit={handleShippingSubmit}
              onBack={() => setStep(1)}
            />
          )}

          {/* STEP 3: PAYMENT FORM */}
          {activeStep === 3 && (
            <PaymentForm
              totalAmount={total}
              onSubmit={handlePaymentSubmit}
              onBack={() => setStep(2)}
              isProcessing={isProcessingOrder}
            />
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <div className="w-full lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6 sticky top-24">
          <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try 'SAVE10' or 'VIP20'"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm uppercase font-medium outline-none focus:border-gray-900 focus:bg-white"
              />
              <button
                type="submit"
                disabled={promoApplied || !promoCode.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 disabled:opacity-40 transition-all cursor-pointer"
              >
                {promoApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {promoError && (
              <span className="text-[11px] text-red-500 font-medium">{promoError}</span>
            )}
            {promoApplied && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> {discountPercent}% discount active
              </span>
            )}
          </form>

          <hr className="border-gray-100" />

          {/* Cost breakdown */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({discountPercent}%)</span>
                <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <div className="flex items-center gap-1">
                <span>Shipping Fee</span>
                {subtotal > 50 && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">
                    FREE
                  </span>
                )}
              </div>
              <span className="font-semibold text-gray-900">
                {shippingFee === 0 ? "$0.00" : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Estimated Taxes</span>
              <span className="text-gray-400 text-xs">Included in price</span>
            </div>

            <hr className="border-gray-100 my-1" />

            <div className="flex justify-between items-baseline text-base">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Continue button for Step 1 */}
          {activeStep === 1 && (
            <button
              onClick={() => setStep(2)}
              disabled={cart.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted checkout &amp; money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-32">
          <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
