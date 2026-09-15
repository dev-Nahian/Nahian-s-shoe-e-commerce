"use client";

import { ShippingFormInputs } from "@/types";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Mail, User, Phone, Globe, Building } from "lucide-react";

interface ShippingFormProps {
  initialData?: Partial<ShippingFormInputs>;
  onSubmit: (data: ShippingFormInputs) => void;
  onBack: () => void;
}

const ShippingForm = ({ initialData, onSubmit, onBack }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormInputs>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    postalCode: initialData?.postalCode || "",
    country: initialData?.country || "United States",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errs.email = "Valid email address is required";
    if (!formData.phone.trim() || formData.phone.length < 7)
      errs.phone = "Valid phone number is required";
    if (!formData.address.trim()) errs.address = "Street address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.postalCode?.trim()) errs.postalCode = "ZIP / Postal code is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Information</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Where should we deliver your order? Please enter your accurate address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Nahian Islam"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.name
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.name && <span className="text-[10px] text-red-500">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            Email Address *
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.email
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.phone
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Street Address *
          </label>
          <input
            type="text"
            placeholder="123 Performance Way, Apt 4B"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.address
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.address && <span className="text-[10px] text-red-500">{errors.address}</span>}
        </div>

        {/* City */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-gray-400" />
            City *
          </label>
          <input
            type="text"
            placeholder="New York"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.city
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.city && <span className="text-[10px] text-red-500">{errors.city}</span>}
        </div>

        {/* Postal Code */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            ZIP / Postal Code *
          </label>
          <input
            type="text"
            placeholder="10001"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
              errors.postalCode
                ? "border-red-500 bg-red-50/20"
                : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900"
            }`}
          />
          {errors.postalCode && (
            <span className="text-[10px] text-red-500">{errors.postalCode}</span>
          )}
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            Country
          </label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-xs sm:text-sm outline-none focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-gray-900 cursor-pointer"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Bangladesh">Bangladesh</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 dark:bg-white dark:text-gray-950 text-white text-xs sm:text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-98 transition-all shadow-md cursor-pointer"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;
