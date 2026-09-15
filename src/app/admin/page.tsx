"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/stores/productStore";
import { useContentStore, PerkItem } from "@/stores/contentStore";
import { useOrderStore, StoredOrder } from "@/stores/orderStore";
import { useToast } from "@/context/ToastContext";
import { ProductType } from "@/types";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  ShoppingBag,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Layers,
  Star,
  RefreshCw,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";

type TabType = "overview" | "products" | "content" | "orders" | "settings";

const PRESET_IMAGES = [
  { label: "Adidas Gray", url: "/products/1g.png" },
  { label: "Adidas Purple", url: "/products/1p.png" },
  { label: "Adidas Green", url: "/products/1gr.png" },
  { label: "Puma Gray", url: "/products/2g.png" },
  { label: "Puma Green", url: "/products/2gr.png" },
  { label: "Nike Green", url: "/products/3gr.png" },
  { label: "Nike Blue", url: "/products/3b.png" },
  { label: "Nike Black", url: "/products/3bl.png" },
  { label: "Nike White", url: "/products/4w.png" },
  { label: "Nike Pink", url: "/products/4p.png" },
  { label: "UA Red", url: "/products/5r.png" },
  { label: "UA Orange", url: "/products/5o.png" },
  { label: "UA Black", url: "/products/5bl.png" },
  { label: "Nike Air Gray", url: "/products/6g.png" },
  { label: "Nike Air White", url: "/products/6w.png" },
  { label: "Ultraboost Gray", url: "/products/7g.png" },
  { label: "Ultraboost Pink", url: "/products/7p.png" },
  { label: "Levis Blue", url: "/products/8b.png" },
  { label: "Levis Green", url: "/products/8gr.png" },
];

const AVAILABLE_SIZES = ["xs", "s", "m", "l", "xl", "xxl", "39", "40", "41", "42", "43", "44", "45"];
const COMMON_CATEGORIES = ["t-shirts", "shoes", "jackets", "accessories", "pants", "hoodies"];

export default function AdminDashboardPage() {
  const { success, info, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [mounted, setMounted] = useState(false);

  // Stores
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleFeatured,
    resetToDefault: resetProducts,
  } = useProductStore();

  const {
    hero,
    promo,
    perks,
    storeInfo,
    updateHero,
    updatePromo,
    updatePerk,
    updateStoreInfo,
    resetContentToDefault: resetContent,
  } = useContentStore();

  const { orders, updateOrderStatus, deleteOrder } = useOrderStore();

  // Products UI State
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "outOfStock">("all");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  // Form State for Product Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    shortDescription: string;
    description: string;
    price: string;
    originalPrice: string;
    sizes: string[];
    colors: { name: string; imageUrl: string }[];
    rating: string;
    reviewsCount: string;
    isFeatured: boolean;
    inStock: boolean;
  }>({
    name: "",
    category: "t-shirts",
    shortDescription: "",
    description: "",
    price: "",
    originalPrice: "",
    sizes: ["s", "m", "l"],
    colors: [{ name: "black", imageUrl: "/products/1g.png" }],
    rating: "4.9",
    reviewsCount: "10",
    isFeatured: true,
    inStock: true,
  });

  // Content Customizer Form States
  const [heroForm, setHeroForm] = useState(hero);
  const [promoForm, setPromoForm] = useState(promo);
  const [perksForm, setPerksForm] = useState(perks);
  const [storeInfoForm, setStoreInfoForm] = useState(storeInfo);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHeroForm(hero);
    setPromoForm(promo);
    setPerksForm(perks);
    setStoreInfoForm(storeInfo);
  }, [hero, promo, perks, storeInfo]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === "" ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && p.inStock) ||
      (stockFilter === "outOfStock" && !p.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Overview Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      category: "t-shirts",
      shortDescription: "",
      description: "",
      price: "",
      originalPrice: "",
      sizes: ["s", "m", "l"],
      colors: [{ name: "default", imageUrl: "/products/1g.png" }],
      rating: "5.0",
      reviewsCount: "0",
      isFeatured: false,
      inStock: true,
    });
    setIsAddEditModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (product: ProductType) => {
    setEditingProductId(product.id);
    const colorList = Object.entries(product.images).map(([name, imageUrl]) => ({
      name,
      imageUrl,
    }));

    setFormData({
      name: product.name,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      sizes: product.sizes || [],
      colors: colorList.length > 0 ? colorList : [{ name: "default", imageUrl: "/products/1g.png" }],
      rating: String(product.rating ?? 5.0),
      reviewsCount: String(product.reviewsCount ?? 0),
      isFeatured: Boolean(product.isFeatured),
      inStock: Boolean(product.inStock),
    });
    setIsAddEditModalOpen(true);
  };

  // Submit Product Form (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showError("Product name and price are required");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      showError("Please enter a valid price");
      return;
    }

    const imagesObj: Record<string, string> = {};
    formData.colors.forEach((c) => {
      const colorKey = c.name.trim().toLowerCase() || "default";
      imagesObj[colorKey] = c.imageUrl.trim() || "/products/1g.png";
    });

    const colorsList = Object.keys(imagesObj);

    if (editingProductId !== null) {
      // Edit
      updateProduct(editingProductId, {
        name: formData.name,
        category: formData.category.toLowerCase().trim(),
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: priceNum,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizes: formData.sizes,
        colors: colorsList,
        images: imagesObj,
        rating: parseFloat(formData.rating) || 5.0,
        reviewsCount: parseInt(formData.reviewsCount) || 0,
        isFeatured: formData.isFeatured,
        inStock: formData.inStock,
      });
      success(`Updated "${formData.name}" successfully!`);
    } else {
      // Add
      addProduct({
        name: formData.name,
        category: formData.category.toLowerCase().trim(),
        shortDescription: formData.shortDescription || "Premium apparel engineered for comfort.",
        description: formData.description || "High quality materials designed for endurance and style.",
        price: priceNum,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizes: formData.sizes.length > 0 ? formData.sizes : ["s", "m", "l"],
        colors: colorsList.length > 0 ? colorsList : ["black"],
        images: Object.keys(imagesObj).length > 0 ? imagesObj : { black: "/products/1g.png" },
        rating: parseFloat(formData.rating) || 5.0,
        reviewsCount: parseInt(formData.reviewsCount) || 0,
        isFeatured: formData.isFeatured,
        inStock: formData.inStock,
      });
      success(`Added "${formData.name}" to catalog!`);
    }

    setIsAddEditModalOpen(false);
  };

  // Save Content Changes
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero(heroForm);
    updatePromo(promoForm);
    perksForm.forEach((p) => updatePerk(p.id, p));
    updateStoreInfo(storeInfoForm);
    success("Storefront content updated successfully! Check your homepage.");
  };

  // Color Variant Helpers
  const addColorVariant = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "new-color", imageUrl: "/products/1g.png" }],
    });
  };

  const removeColorVariant = (index: number) => {
    if (formData.colors.length <= 1) {
      showError("At least one color variant is required.");
      return;
    }
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const updateColorVariant = (index: number, field: "name" | "imageUrl", value: string) => {
    const updated = [...formData.colors];
    updated[index][field] = value;
    setFormData({ ...formData, colors: updated });
  };

  // Size toggle helper
  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s !== size),
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size],
      });
    }
  };

  // Image Upload simulation / preset handler
  const handleImageFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateColorVariant(index, "imageUrl", event.target.result as string);
        info("Image uploaded and loaded into preview!");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8 my-6 w-full">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-md">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Operations</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Live Store
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage product catalog, upload new items, customize hero content and track orders.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-xs font-semibold text-gray-700 hover:text-gray-900 transition-all shadow-xs"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "products"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "content"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Storefront &amp; Hero Content</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Overview Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === "products" && (
        <div className="flex flex-col gap-6">
          {/* FILTER AND SEARCH BAR */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-gray-900"
              >
                <option value="all">All Categories</option>
                {COMMON_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium outline-none focus:border-gray-900"
              >
                <option value="all">All Stock Status</option>
                <option value="inStock">In Stock Only</option>
                <option value="outOfStock">Out of Stock</option>
              </select>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Product</span>
              </button>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Sizes &amp; Colors</th>
                    <th className="py-3.5 px-4 text-center">Featured</th>
                    <th className="py-3.5 px-4 text-center">Stock</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const primaryImage =
                      Object.values(p.images)[0] || "/products/1g.png";

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Title + Thumbnail */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                              <Image
                                src={primaryImage}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/products/${p.id}`}
                                target="_blank"
                                className="font-semibold text-gray-900 hover:text-amber-600 transition-colors line-clamp-1 flex items-center gap-1 group"
                              >
                                <span>{p.name}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <span className="text-xs text-gray-400">ID: {String(p.id).slice(0, 10)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">${p.price.toFixed(2)}</span>
                            {p.originalPrice && (
                              <span className="text-[11px] text-gray-400 line-through">
                                ${p.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Sizes & Colors */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <div className="flex gap-1 flex-wrap">
                              {p.sizes.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase text-[10px] font-bold"
                                >
                                  {s}
                                </span>
                              ))}
                              {p.sizes.length > 4 && (
                                <span className="text-[10px] text-gray-400 font-medium">
                                  +{p.sizes.length - 4}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 text-[11px]">
                              {p.colors.length} color variant{p.colors.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              toggleFeatured(p.id);
                              info(`Toggled featured for ${p.name}`);
                            }}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              p.isFeatured
                                ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                : "bg-gray-100 text-gray-400 hover:text-gray-600"
                            }`}
                            title={p.isFeatured ? "Featured on homepage" : "Not featured"}
                          >
                            <Star className={`w-4 h-4 ${p.isFeatured ? "fill-amber-500" : ""}`} />
                          </button>
                        </td>

                        {/* Stock Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              toggleStock(p.id);
                              info(`Stock status changed for ${p.name}`);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              p.inStock
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                  success(`Deleted "${p.name}"`);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500">
                <Package className="w-10 h-10 text-gray-300 mb-2" />
                <p className="font-semibold text-gray-800">No matching products found</p>
                <p className="text-xs text-gray-400 mt-0.5">Try modifying your search or filter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STOREFRONT & HERO CONTENT CUSTOMIZER */}
      {activeTab === "content" && (
        <form onSubmit={handleSaveContent} className="flex flex-col gap-8">
          {/* HERO BANNER SECTION */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900">Hero Banner Customization</h3>
              </div>
              <span className="text-xs text-gray-400">Controls the main homepage hero presentation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Collection Badge Tag</label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Discount Pill Badge</label>
                <input
                  type="text"
                  value={heroForm.discountBadge}
                  onChange={(e) => setHeroForm({ ...heroForm, discountBadge: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Main Headline Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Highlighted Color Phrase</label>
                <input
                  type="text"
                  value={heroForm.highlightText}
                  onChange={(e) => setHeroForm({ ...heroForm, highlightText: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Sub-description</label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Primary Button Label</label>
                <input
                  type="text"
                  value={heroForm.primaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Secondary Button Label</label>
                <input
                  type="text"
                  value={heroForm.secondaryButtonText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryButtonText: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* PROMO ANNOUNCEMENT BAR SECTION */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Promo Bar &amp; Discount Campaign</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={promoForm.enabled}
                  onChange={(e) => setPromoForm({ ...promoForm, enabled: e.target.checked })}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span>Active Banner</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Banner Announcement Text</label>
                <input
                  type="text"
                  value={promoForm.message}
                  onChange={(e) => setPromoForm({ ...promoForm, message: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Promo Code</label>
                <input
                  type="text"
                  value={promoForm.promoCode}
                  onChange={(e) => setPromoForm({ ...promoForm, promoCode: e.target.value.toUpperCase() })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm uppercase font-bold outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* TRUST PERKS SECTION */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Store Trust Factors &amp; Perks</h3>
              <p className="text-xs text-gray-500 mt-0.5">Edit the 4 customer guarantee cards on the homepage</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {perksForm.map((perk, idx) => (
                <div key={perk.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60 flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Perk #{idx + 1}</span>
                  <input
                    type="text"
                    value={perk.title}
                    onChange={(e) => {
                      const updated = [...perksForm];
                      updated[idx].title = e.target.value;
                      setPerksForm(updated);
                    }}
                    placeholder="Perk Title"
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm font-semibold outline-none focus:border-gray-900"
                  />
                  <textarea
                    rows={2}
                    value={perk.description}
                    onChange={(e) => {
                      const updated = [...perksForm];
                      updated[idx].description = e.target.value;
                      setPerksForm(updated);
                    }}
                    placeholder="Short description"
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs outline-none focus:border-gray-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetContent();
                info("Reset content to defaults");
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Reset Defaults
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save All Content Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Customer Orders ({orders.length})</h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage, review, and update customer order fulfillment statuses.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-gray-900">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{order.shipping.name}</span>
                        <span className="text-xs text-gray-400">{order.shipping.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600 font-medium">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-gray-100 text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateOrderStatus(order.orderNumber, e.target.value as any);
                          success(`Status for ${order.orderNumber} changed to ${e.target.value}`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold outline-none border cursor-pointer ${
                          order.status === "delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : order.status === "shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : order.status === "processing"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete order ${order.orderNumber}?`)) {
                              deleteOrder(order.orderNumber);
                              info(`Order ${order.orderNumber} deleted`);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500">
              <ShoppingBag className="w-10 h-10 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-800">No orders placed yet</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OVERVIEW ANALYTICS */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Total Gross Revenue</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">
                  ${totalRevenue.toFixed(2)}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% this month
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Total Orders Placed</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrdersCount}</p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> 100% fulfillment rate
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Active Products</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{products.length}</p>
                <span className="text-[11px] text-gray-500 font-medium mt-1">
                  {inStockCount} In Stock • {featuredCount} Featured
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 font-medium">Average Order Value</span>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">
                  ${totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : "0.00"}
                </p>
                <span className="text-[11px] text-gray-500 font-medium mt-1">Across all channels</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* QUICK SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-base">Catalog by Category</h4>
              <div className="flex flex-col gap-3">
                {COMMON_CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category.toLowerCase() === cat).length;
                  const percent = Math.round((count / (products.length || 1)) * 100);
                  return (
                    <div key={cat} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700 capitalize">
                        <span>{cat}</span>
                        <span>
                          {count} item{count === 1 ? "" : "s"} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Quick System Actions</h4>
                <p className="text-xs text-gray-500 mb-6">
                  Manage persistent browser cache and restore default demo catalog.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetProducts();
                    resetContent();
                    success("All products and content restored to factory defaults!");
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restore Factory Demo Catalog &amp; Banners</span>
                </button>

                <Link
                  href="/products"
                  className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Customer Storefront</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STORE SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6 max-w-2xl">
          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">General Store Settings</h3>
            <p className="text-xs text-gray-500 mt-0.5">Configure store info, thresholds, and currency preferences</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Store Name</label>
              <input
                type="text"
                value={storeInfoForm.storeName}
                onChange={(e) => setStoreInfoForm({ ...storeInfoForm, storeName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Store Tagline</label>
              <input
                type="text"
                value={storeInfoForm.tagline}
                onChange={(e) => setStoreInfoForm({ ...storeInfoForm, tagline: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Currency Symbol</label>
                <input
                  type="text"
                  value={storeInfoForm.currencySymbol}
                  onChange={(e) => setStoreInfoForm({ ...storeInfoForm, currencySymbol: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  value={storeInfoForm.freeShippingThreshold}
                  onChange={(e) =>
                    setStoreInfoForm({ ...storeInfoForm, freeShippingThreshold: parseFloat(e.target.value) || 0 })
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  updateStoreInfo(storeInfoForm);
                  success("Store settings saved!");
                }}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProductId !== null ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure titles, categories, pricing, variant images, and sizes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Form */}
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nike Pro Storm Runner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm capitalize outline-none focus:border-gray-900 focus:bg-white"
                  >
                    {COMMON_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Current Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="49.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Original / MSRP Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="69.99"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Short & Long Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Short Summary Description</label>
                <input
                  type="text"
                  placeholder="Breathable athletic gear designed for comfort."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide in-depth details about materials, build, and features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              {/* Sizes Available */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-700">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gray-900 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Variants & Images */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Color Variants &amp; Product Images
                  </label>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Color</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      {/* Thumbnail Preview */}
                      <div className="relative w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                        <Image
                          src={color.imageUrl || "/products/1g.png"}
                          alt={color.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Color Name */}
                      <input
                        type="text"
                        placeholder="Color (e.g. black, blue)"
                        value={color.name}
                        onChange={(e) => updateColorVariant(index, "name", e.target.value)}
                        className="w-28 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium outline-none focus:border-gray-900"
                      />

                      {/* Image URL / Presets */}
                      <div className="flex-1 flex gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Image URL or choose preset"
                          value={color.imageUrl}
                          onChange={(e) => updateColorVariant(index, "imageUrl", e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs outline-none focus:border-gray-900"
                        />

                        {/* Preset Image Picker */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              updateColorVariant(index, "imageUrl", e.target.value);
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 outline-none"
                        >
                          <option value="">Presets</option>
                          {PRESET_IMAGES.map((img) => (
                            <option key={img.url} value={img.url}>
                              {img.label}
                            </option>
                          ))}
                        </select>

                        {/* File Upload Trigger */}
                        <label className="px-2.5 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold cursor-pointer flex items-center gap-1">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileUpload(index, e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {formData.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColorVariant(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles (Stock & Featured) */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span>Mark as In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingProductId !== null ? "Save Product Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS INSPECTOR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-400">Order Summary</span>
                <h3 className="text-xl font-bold text-gray-900 font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs flex flex-col gap-2">
              <span className="font-bold text-gray-900 uppercase">Customer &amp; Shipping</span>
              <p className="text-gray-700">
                <strong>Name:</strong> {selectedOrder.shipping.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {selectedOrder.shipping.email}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {selectedOrder.shipping.phone}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {selectedOrder.shipping.address}, {selectedOrder.shipping.city},{" "}
                {selectedOrder.shipping.postalCode} ({selectedOrder.shipping.country})
              </p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-900 uppercase">Ordered Items</span>
              <div className="divide-y divide-gray-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <Image
                          src={
                            item.images[item.selectedColor] ||
                            Object.values(item.images)[0] ||
                            "/products/1g.png"
                          }
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-400">
                          Qty: {item.quantity} • Size: {item.selectedSize.toUpperCase()} • Color: {item.selectedColor}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900 text-sm">Grand Total Paid</span>
              <span className="text-xl font-extrabold text-gray-900">
                ${selectedOrder.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
