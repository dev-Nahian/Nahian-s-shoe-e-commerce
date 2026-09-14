"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { success, info } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        success(`Welcome back, ${formData.email || "user"}!`);
      } else {
        success(`Account created successfully for ${formData.name || "user"}!`);
      }
      router.push("/");
    }, 800);
  };

  const fillDemo = () => {
    setFormData({
      name: "Nahian Demo",
      email: "nahian@example.com",
      password: "password123",
    });
    info("Demo credentials filled!");
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl flex flex-col gap-6">
        {/* BRAND HEADER */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NAHIAN&apos;s Member Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            {isLogin
              ? "Sign in to track orders, save items and checkout faster."
              : "Join our club for exclusive discounts and early releases."}
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              isLogin ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              !isLogin ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Nahian Islam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-gray-900 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-gray-900 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => info("Password reset link sent to email.")}
                  className="text-gray-500 hover:text-gray-900 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-gray-900 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember my login for 30 days
              </label>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold shadow-md active:scale-98 transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Sign In to Account" : "Create My Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* DEMO CREDENTIALS QUICK FILL */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
          <button
            type="button"
            onClick={fillDemo}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-gray-300 hover:border-gray-900 bg-gray-50 hover:bg-white text-xs font-medium text-gray-700 hover:text-gray-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Fill Demo Credentials</span>
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            By signing in you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
