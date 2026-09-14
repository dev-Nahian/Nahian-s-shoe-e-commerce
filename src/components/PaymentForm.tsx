"use client";

import { PaymentFormInputs } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CreditCard, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PaymentFormProps {
  totalAmount: number;
  onSubmit: (data: PaymentFormInputs) => void;
  onBack: () => void;
  isProcessing?: boolean;
}

const PaymentForm = ({
  totalAmount,
  onSubmit,
  onBack,
  isProcessing = false,
}: PaymentFormProps) => {
  const [method, setMethod] = useState<"card" | "klarna" | "stripe" | "paypal">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format Card Number input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Format MM/YY
  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpirationDate(val);
  };

  // Format CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(val);
  };

  const validate = () => {
    if (method !== "card") return true;

    const errs: Record<string, string> = {};
    if (!cardHolder.trim()) errs.cardHolder = "Cardholder name is required";
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 15) errs.cardNumber = "Valid 16-digit card number is required";
    if (!/^\d{2}\/\d{2}$/.test(expirationDate))
      errs.expirationDate = "Valid MM/YY required";
    if (cvv.length < 3) errs.cvv = "Valid CVV required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        paymentMethod: method,
        cardHolder,
        cardNumber,
        expirationDate,
        cvv,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
        <p className="text-xs text-gray-500 mt-1">
          Select your preferred payment method. All transactions are securely encrypted.
        </p>
      </div>

      {/* PAYMENT METHOD SELECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Credit Card Option */}
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer ${
            method === "card"
              ? "border-gray-900 bg-gray-50 shadow-xs"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-5 h-5 text-gray-800" />
            {method === "card" && <CheckCircle2 className="w-4 h-4 text-gray-900" />}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">Credit Card</span>
            <span className="text-[11px] text-gray-500">Visa, MC, Amex</span>
          </div>
        </button>

        {/* Klarna Option */}
        <button
          type="button"
          onClick={() => setMethod("klarna")}
          className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer ${
            method === "klarna"
              ? "border-gray-900 bg-pink-50/40 shadow-xs"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="relative w-12 h-5">
              <Image src="/klarna.png" alt="Klarna" fill sizes="48px" className="object-contain" />
            </div>
            {method === "klarna" && <CheckCircle2 className="w-4 h-4 text-gray-900" />}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">Pay in 4</span>
            <span className="text-[11px] text-gray-500">4x ${(totalAmount / 4).toFixed(2)}</span>
          </div>
        </button>

        {/* Stripe Option */}
        <button
          type="button"
          onClick={() => setMethod("stripe")}
          className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 text-left transition-all cursor-pointer ${
            method === "stripe"
              ? "border-gray-900 bg-indigo-50/40 shadow-xs"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="relative w-12 h-5">
              <Image src="/stripe.png" alt="Stripe" fill sizes="48px" className="object-contain" />
            </div>
            {method === "stripe" && <CheckCircle2 className="w-4 h-4 text-gray-900" />}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 block">Stripe 1-Click</span>
            <span className="text-[11px] text-gray-500">Fast checkout</span>
          </div>
        </button>
      </div>

      {/* CARD DETAILS FORM */}
      {method === "card" && (
        <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Card Details</span>
            <div className="relative w-36 h-6">
              <Image src="/cards.png" alt="Accepted cards" fill sizes="144px" className="object-contain" />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-600">Cardholder Name *</label>
            <input
              type="text"
              placeholder="Full Name as on card"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl bg-white border text-xs sm:text-sm outline-none transition-all ${
                errors.cardHolder ? "border-red-500" : "border-gray-200 focus:border-gray-900"
              }`}
            />
            {errors.cardHolder && (
              <span className="text-[10px] text-red-500">{errors.cardHolder}</span>
            )}
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-600">Card Number *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="4532 •••• •••• 8892"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`w-full pl-3.5 pr-10 py-2 rounded-xl bg-white border text-xs sm:text-sm outline-none transition-all font-mono ${
                  errors.cardNumber ? "border-red-500" : "border-gray-200 focus:border-gray-900"
                }`}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.cardNumber && (
              <span className="text-[10px] text-red-500">{errors.cardNumber}</span>
            )}
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600">Expiration (MM/YY) *</label>
              <input
                type="text"
                placeholder="12/28"
                value={expirationDate}
                onChange={handleExpirationChange}
                className={`w-full px-3.5 py-2 rounded-xl bg-white border text-xs sm:text-sm outline-none transition-all font-mono ${
                  errors.expirationDate ? "border-red-500" : "border-gray-200 focus:border-gray-900"
                }`}
              />
              {errors.expirationDate && (
                <span className="text-[10px] text-red-500">{errors.expirationDate}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600">CVV / CVC *</label>
              <input
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={handleCvvChange}
                className={`w-full px-3.5 py-2 rounded-xl bg-white border text-xs sm:text-sm outline-none transition-all font-mono ${
                  errors.cvv ? "border-red-500" : "border-gray-200 focus:border-gray-900"
                }`}
              />
              {errors.cvv && <span className="text-[10px] text-red-500">{errors.cvv}</span>}
            </div>
          </div>
        </div>
      )}

      {/* KLARNA PROMPT */}
      {method === "klarna" && (
        <div className="p-5 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col gap-2 text-xs text-pink-950">
          <p className="font-semibold">Klarna 4-Interest-Free Payments</p>
          <p className="text-gray-600 leading-relaxed">
            You will be redirected to Klarna to complete your 4 installments of $
            {(totalAmount / 4).toFixed(2)} with no interest or hidden fees.
          </p>
        </div>
      )}

      {/* STRIPE PROMPT */}
      {method === "stripe" && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col gap-2 text-xs text-indigo-950">
          <p className="font-semibold">Instant Checkout with Stripe</p>
          <p className="text-gray-600 leading-relaxed">
            Secure, end-to-end encrypted payment powered by Stripe. Apple Pay and Google Pay supported.
          </p>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-bit SSL encrypted secure checkout</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipping</span>
        </button>

        <button
          type="submit"
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 active:scale-98 transition-all shadow-lg cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          <span>{isProcessing ? "Processing Payment..." : `Pay $${totalAmount.toFixed(2)}`}</span>
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
