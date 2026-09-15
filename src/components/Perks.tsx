"use client";

import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { useContentStore } from "@/stores/contentStore";
import { useEffect, useState } from "react";

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case "truck":
      return <Truck className="w-6 h-6 text-amber-600" />;
    case "shieldcheck":
      return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
    case "rotateccw":
    case "refreshcw":
      return <RotateCcw className="w-6 h-6 text-blue-600" />;
    case "headphones":
    default:
      return <Headphones className="w-6 h-6 text-purple-600" />;
  }
};

const Perks = () => {
  const { perks } = useContentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-16 p-8 bg-white border border-gray-100 rounded-3xl shadow-xs">
      {perks.map((perk, idx) => (
        <div key={perk.id || idx} className="flex items-start gap-4">
          <div className="p-3 bg-gray-50 rounded-2xl shadow-xs shrink-0 border border-gray-100">
            {getIcon(perk.icon)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{perk.title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{perk.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Perks;
