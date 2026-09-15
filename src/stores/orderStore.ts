import { CartItemsType, ShippingFormInputs } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoredOrder {
  id: string;
  orderNumber: string;
  items: CartItemsType;
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  shipping: ShippingFormInputs;
  paymentMethod: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface OrderStoreState {
  orders: StoredOrder[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addOrder: (order: Omit<StoredOrder, "id" | "createdAt">) => StoredOrder;
  updateOrderStatus: (orderNumber: string, status: StoredOrder["status"]) => void;
  deleteOrder: (orderNumber: string) => void;
  getOrder: (orderNumber: string) => StoredOrder | undefined;
}

const defaultOrders: StoredOrder[] = [
  {
    id: "ord-101",
    orderNumber: "#ORD-942814",
    items: [
      {
        id: 1,
        name: "Adidas CoreFit T-Shirt",
        category: "t-shirts",
        shortDescription: "Ultra-breathable athletic t-shirt.",
        description: "Advanced moisture-wicking fabric.",
        price: 39.9,
        sizes: ["s", "m", "l", "xl"],
        colors: ["gray", "purple", "green"],
        images: { gray: "/products/1g.png" },
        quantity: 2,
        selectedSize: "l",
        selectedColor: "gray",
      },
      {
        id: 6,
        name: "Nike Air Max 270",
        category: "shoes",
        shortDescription: "Next-gen lifestyle sneaker.",
        description: "Nike's first lifestyle Air unit.",
        price: 129.9,
        sizes: ["40", "41", "42", "43"],
        colors: ["gray", "white"],
        images: { gray: "/products/6g.png" },
        quantity: 1,
        selectedSize: "42",
        selectedColor: "gray",
      },
    ],
    total: 209.7,
    subtotal: 209.7,
    shippingFee: 0,
    discount: 0,
    shipping: {
      name: "Nahian Islam",
      email: "nahian@example.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
      country: "United States",
    },
    paymentMethod: "card",
    status: "processing",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ord-102",
    orderNumber: "#ORD-817293",
    items: [
      {
        id: 2,
        name: "Puma Ultra Warm Zip",
        category: "jackets",
        shortDescription: "Thermal insulated zip hoodie.",
        description: "Engineered with warmCELL insulation.",
        price: 59.9,
        sizes: ["s", "m", "l"],
        colors: ["gray", "green"],
        images: { green: "/products/2gr.png" },
        quantity: 1,
        selectedSize: "m",
        selectedColor: "green",
      },
    ],
    total: 69.9,
    subtotal: 59.9,
    shippingFee: 10,
    discount: 0,
    shipping: {
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
      address: "123 Broadway Ave",
      city: "New York",
      postalCode: "10001",
      country: "United States",
    },
    paymentMethod: "stripe",
    status: "shipped",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: defaultOrders,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      addOrder: (orderData) => {
        const newOrder: StoredOrder = {
          ...orderData,
          id: `ord-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      updateOrderStatus: (orderNumber, status) => {
        set({
          orders: get().orders.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status } : o
          ),
        });
      },

      deleteOrder: (orderNumber) => {
        set({
          orders: get().orders.filter((o) => o.orderNumber !== orderNumber),
        });
      },

      getOrder: (orderNumber) => {
        return get().orders.find((o) => o.orderNumber === orderNumber);
      },
    }),
    {
      name: "nahian-orders-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
