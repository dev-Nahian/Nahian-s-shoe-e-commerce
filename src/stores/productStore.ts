import { ProductType, ProductsType } from "@/types";
import { products as defaultProducts } from "@/data/products";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductStoreType = {
  products: ProductsType;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addProduct: (product: Omit<ProductType, "id"> & { id?: string | number }) => void;
  updateProduct: (id: string | number, updated: Partial<ProductType>) => void;
  deleteProduct: (id: string | number) => void;
  toggleStock: (id: string | number) => void;
  toggleFeatured: (id: string | number) => void;
  resetToDefault: () => void;
  getProductById: (id: string | number) => ProductType | undefined;
  getRelatedProducts: (id: string | number, limit?: number) => ProductType[];
};

export const useProductStore = create<ProductStoreType>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      addProduct: (product) => {
        const { products } = get();
        const newId = product.id || Date.now().toString();
        const newProduct: ProductType = {
          ...product,
          id: newId,
          rating: product.rating ?? 5.0,
          reviewsCount: product.reviewsCount ?? 0,
          isFeatured: product.isFeatured ?? false,
          inStock: product.inStock ?? true,
        };
        set({ products: [newProduct, ...products] });
      },

      updateProduct: (id, updated) => {
        const { products } = get();
        set({
          products: products.map((p) =>
            String(p.id) === String(id) ? { ...p, ...updated } : p
          ),
        });
      },

      deleteProduct: (id) => {
        const { products } = get();
        set({
          products: products.filter((p) => String(p.id) !== String(id)),
        });
      },

      toggleStock: (id) => {
        const { products } = get();
        set({
          products: products.map((p) =>
            String(p.id) === String(id) ? { ...p, inStock: !p.inStock } : p
          ),
        });
      },

      toggleFeatured: (id) => {
        const { products } = get();
        set({
          products: products.map((p) =>
            String(p.id) === String(id) ? { ...p, isFeatured: !p.isFeatured } : p
          ),
        });
      },

      resetToDefault: () => {
        set({ products: defaultProducts });
      },

      getProductById: (id) => {
        const { products } = get();
        return products.find((p) => String(p.id) === String(id));
      },

      getRelatedProducts: (id, limit = 4) => {
        const { products } = get();
        const current = products.find((p) => String(p.id) === String(id));
        if (!current) return products.slice(0, limit);
        return products
          .filter((p) => String(p.id) !== String(id))
          .sort((a) => (a.category === current.category ? -1 : 1))
          .slice(0, limit);
      },
    }),
    {
      name: "nahian-products-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
