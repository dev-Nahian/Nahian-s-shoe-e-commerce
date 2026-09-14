import { CartItemType, CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set, get) => ({
      cart: [],
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
      addToCart: (product: CartItemType) => {
        const { cart } = get();
        const existingIndex = cart.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedSize === product.selectedSize &&
            item.selectedColor === product.selectedColor
        );

        if (existingIndex > -1) {
          const updatedCart = [...cart];
          updatedCart[existingIndex].quantity += product.quantity || 1;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, product] });
        }
      },
      removeFromCart: (product: CartItemType) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.id === product.id &&
              item.selectedSize === product.selectedSize &&
              item.selectedColor === product.selectedColor
            )
        );
        set({ cart: updatedCart });
      },
      updateQuantity: (product: CartItemType, delta: number) => {
        const { cart } = get();
        const updatedCart = cart
          .map((item) => {
            if (
              item.id === product.id &&
              item.selectedSize === product.selectedSize &&
              item.selectedColor === product.selectedColor
            ) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItemType[];
        set({ cart: updatedCart });
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "nahian-cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useCartStore;
