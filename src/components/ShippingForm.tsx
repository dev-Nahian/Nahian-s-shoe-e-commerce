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
        <h3 className="text-lg font-bold text-gray-900">Shipping Information</h3>
        <p className="text-xs text-gray-500 mt-1">
          Where should we deliver your order? Please enter your accurate address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Full Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.name
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.name && <span className="text-[11px] text-red-500 font-medium">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            Email Address *
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.email
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.email && <span className="text-[11px] text-red-500 font-medium">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.phone
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.phone && <span className="text-[11px] text-red-500 font-medium">{errors.phone}</span>}
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Street Address *
          </label>
          <input
            type="text"
            placeholder="123 Main Street, Apt 4B"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.address
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.address && <span className="text-[11px] text-red-500 font-medium">{errors.address}</span>}
        </div>

        {/* City */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-gray-400" />
            City *
          </label>
          <input
            type="text"
            placeholder="New York"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.city
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.city && <span className="text-[11px] text-red-500 font-medium">{errors.city}</span>}
        </div>

        {/* Postal Code */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">ZIP / Postal Code *</label>
          <input
            type="text"
            placeholder="10001"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              errors.postalCode
                ? "border-red-500 bg-red-50/20 focus:ring-1 focus:ring-red-500"
                : "border-gray-200 bg-gray-50/50 focus:border-gray-900 focus:bg-white"
            }`}
          />
          {errors.postalCode && (
            <span className="text-[11px] text-red-500 font-medium">{errors.postalCode}</span>
          )}
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            Country *
          </label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-gray-900 focus:bg-white cursor-pointer"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Australia">Australia</option>
            <option value="Japan">Japan</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-98 transition-all shadow-md cursor-pointer"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;
