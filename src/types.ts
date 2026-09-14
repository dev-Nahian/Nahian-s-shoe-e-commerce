export type ProductType = {
  id: string | number;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
  rating?: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  inStock?: boolean;
};

export type ProductsType = ProductType[];

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export type ShippingFormInputs = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
};

export type PaymentFormInputs = {
  paymentMethod: "card" | "klarna" | "stripe" | "paypal";
  cardHolder?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
};

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  updateQuantity: (product: CartItemType, delta: number) => void;
  clearCart: () => void;
  setHasHydrated: (state: boolean) => void;
};