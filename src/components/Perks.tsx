import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const perks = [
  {
    icon: <Truck className="w-6 h-6 text-amber-600" />,
    title: "Free Express Shipping",
    description: "On all global orders over $50 with live tracking",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    title: "100% Secure Checkout",
    description: "Encrypted payments via Stripe, Klarna & PayPal",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-blue-600" />,
    title: "30-Day Easy Returns",
    description: "Hassle-free exchanges and instant refunds",
  },
  {
    icon: <Headphones className="w-6 h-6 text-purple-600" />,
    title: "24/7 Dedicated Support",
    description: "Expert team ready to help anytime you need",
  },
];

const Perks = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-16 p-8 bg-gray-50/80 border border-gray-100 rounded-2xl">
      {perks.map((perk, idx) => (
        <div key={idx} className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-xs shrink-0 border border-gray-100">
            {perk.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{perk.title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{perk.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Perks;
