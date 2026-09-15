import { CartItemsType, ShippingFormInputs, PaymentFormInputs } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchProducts(params?: { category?: string; search?: string; sort?: string }) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "all") query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductById(id: string | number) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/products/categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createOrder(data: {
  orderItems: CartItemsType;
  shippingAddress: ShippingFormInputs;
  paymentMethod: PaymentFormInputs["paymentMethod"];
  itemsPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  token?: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (data.token) {
    headers["Authorization"] = `Bearer ${data.token}`;
  }

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit order");
  return res.json();
}

export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to log in");
  }
  return res.json();
}

export async function registerUser(userData: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to register");
  }
  return res.json();
}
