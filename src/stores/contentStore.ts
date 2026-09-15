import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface HeroContent {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  bannerImage: string;
  discountBadge: string;
}

export interface PromoContent {
  enabled: boolean;
  message: string;
  highlight: string;
  promoCode: string;
  discount: number;
}

export interface PerkItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StoreInfo {
  storeName: string;
  tagline: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
}

export interface ContentStoreState {
  hero: HeroContent;
  promo: PromoContent;
  perks: PerkItem[];
  storeInfo: StoreInfo;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateHero: (data: Partial<HeroContent>) => void;
  updatePromo: (data: Partial<PromoContent>) => void;
  updatePerk: (id: string, data: Partial<PerkItem>) => void;
  updateStoreInfo: (data: Partial<StoreInfo>) => void;
  resetContentToDefault: () => void;
}

const defaultHero: HeroContent = {
  badge: "Spring/Summer Collection 2026",
  title: "Redefine Your Everyday Performance",
  highlightText: "Peak Endurance.",
  description:
    "Engineered with ultra-breathable fabrics and modern athletic silhouettes designed to transition seamlessly from high-intensity training to city streets.",
  primaryButtonText: "Shop the Collection",
  primaryButtonLink: "/products",
  secondaryButtonText: "View T-Shirts",
  secondaryButtonLink: "/products?category=t-shirts",
  bannerImage: "/featured.png",
  discountBadge: "Up to 40% Off New Arrivals",
};

const defaultPromo: PromoContent = {
  enabled: true,
  message: "⚡ Limited Spring Sale: Get 10% Off with code",
  highlight: "SAVE10",
  promoCode: "SAVE10",
  discount: 10,
};

const defaultPerks: PerkItem[] = [
  {
    id: "shipping",
    title: "Free Worldwide Express",
    description: "On all orders above $50.00 with end-to-end tracking.",
    icon: "Truck",
  },
  {
    id: "security",
    title: "Secure 256-Bit Checkout",
    description: "Encrypted payments powered by Stripe, Cards & Klarna.",
    icon: "ShieldCheck",
  },
  {
    id: "returns",
    title: "30-Day Money Back",
    description: "Hassle-free return policy with prepaid shipping labels.",
    icon: "RotateCcw",
  },
  {
    id: "support",
    title: "24/7 Dedicated Support",
    description: "Round-the-clock priority customer service whenever you need it.",
    icon: "Headphones",
  },
];

const defaultStoreInfo: StoreInfo = {
  storeName: "NAHIAN's",
  tagline: "Modern Performance & Lifestyle Essentials",
  currencySymbol: "$",
  freeShippingThreshold: 50,
  contactEmail: "support@nahianstore.com",
  contactPhone: "+1 (800) 555-0199",
};

export const useContentStore = create<ContentStoreState>()(
  persist(
    (set, get) => ({
      hero: defaultHero,
      promo: defaultPromo,
      perks: defaultPerks,
      storeInfo: defaultStoreInfo,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      updateHero: (data) => {
        set({ hero: { ...get().hero, ...data } });
      },

      updatePromo: (data) => {
        set({ promo: { ...get().promo, ...data } });
      },

      updatePerk: (id, data) => {
        set({
          perks: get().perks.map((p) => (p.id === id ? { ...p, ...data } : p)),
        });
      },

      updateStoreInfo: (data) => {
        set({ storeInfo: { ...get().storeInfo, ...data } });
      },

      resetContentToDefault: () => {
        set({
          hero: defaultHero,
          promo: defaultPromo,
          perks: defaultPerks,
          storeInfo: defaultStoreInfo,
        });
      },
    }),
    {
      name: "nahian-content-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
