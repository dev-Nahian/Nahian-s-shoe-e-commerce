import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 mb-6 shadow-inner">
        <PackageSearch className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
        The page or product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
