import { ProductsType } from "@/types";

export const products: ProductsType = [
  {
    id: 1,
    name: "Adidas CoreFit T-Shirt",
    category: "t-shirts",
    shortDescription: "Ultra-breathable athletic t-shirt engineered for comfort and maximum mobility.",
    description:
      "Crafted with advanced moisture-wicking fabric, the Adidas CoreFit T-Shirt keeps you cool and dry through intense workouts and everyday adventures. Featuring seamless stitching, ribbed collar, and four-way stretch construction for total freedom of motion.",
    price: 39.9,
    originalPrice: 49.9,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: {
      gray: "/products/1g.png",
      purple: "/products/1p.png",
      green: "/products/1gr.png",
    },
    rating: 4.8,
    reviewsCount: 124,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Puma Ultra Warm Zip",
    category: "jackets",
    shortDescription: "Thermal insulated zip hoodie for cold weather training and casual streetwear.",
    description:
      "Engineered with warmCELL thermal insulation that traps heat close to your body to keep you warm when the temperature drops. Features dual zippered hand pockets, storm flap hood, and elastic bound cuffs.",
    price: 59.9,
    originalPrice: 79.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: {
      gray: "/products/2g.png",
      green: "/products/2gr.png",
    },
    rating: 4.9,
    reviewsCount: 89,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 3,
    name: "Nike Air Essentials Pullover",
    category: "jackets",
    shortDescription: "Iconic fleece pullover hoodie with relaxed fit and brushed interior comfort.",
    description:
      "The Nike Air Essentials Pullover blends streetwear attitude with all-day cozy comfort. Soft cotton-blend fleece, adjustable drawstring hood, kangaroo pouch pocket, and bold heritage Nike Air graphics.",
    price: 69.9,
    originalPrice: 85.0,
    sizes: ["s", "m", "l", "xl"],
    colors: ["green", "blue", "black"],
    images: {
      green: "/products/3gr.png",
      blue: "/products/3b.png",
      black: "/products/3bl.png",
    },
    rating: 4.7,
    reviewsCount: 215,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 4,
    name: "Nike Dri Flex T-Shirt",
    category: "t-shirts",
    shortDescription: "Lightweight performance activewear shirt with ergonomic ventilation panels.",
    description:
      "Featuring high-performance Dri-FIT microfibers that disperse sweat rapidly over the surface for fast evaporation. Flatlock seams prevent chafing during long training sessions.",
    price: 29.9,
    originalPrice: 35.0,
    sizes: ["s", "m", "l"],
    colors: ["white", "pink"],
    images: {
      white: "/products/4w.png",
      pink: "/products/4p.png",
    },
    rating: 4.6,
    reviewsCount: 78,
    isFeatured: false,
    inStock: true,
  },
  {
    id: 5,
    name: "Under Armour StormFleece",
    category: "jackets",
    shortDescription: "Water-repellent technical fleece hoodie with breathable UA Storm technology.",
    description:
      "UA Storm technology repels water without sacrificing breathability. Armour Fleece is light, breathable, and stretches for superior mobility, while the soft inner layer traps heat to keep you warm and comfortable.",
    price: 49.9,
    originalPrice: 65.0,
    sizes: ["s", "m", "l"],
    colors: ["red", "orange", "black"],
    images: {
      red: "/products/5r.png",
      orange: "/products/5o.png",
      black: "/products/5bl.png",
    },
    rating: 4.9,
    reviewsCount: 156,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 6,
    name: "Nike Air Max 270",
    category: "shoes",
    shortDescription: "Next-gen lifestyle sneaker with massive Air unit for all-day responsive bounce.",
    description:
      "Nike's first lifestyle Air unit delivers unbeatable cushioning, bouncy response, and striking modern aesthetics. The stretchy inner sleeve creates a snug, sock-like fit with breathable knit upper mesh.",
    price: 129.9,
    originalPrice: 150.0,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["gray", "white"],
    images: {
      gray: "/products/6g.png",
      white: "/products/6w.png",
    },
    rating: 5.0,
    reviewsCount: 340,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 7,
    name: "Nike Ultraboost Pulse",
    category: "shoes",
    shortDescription: "Engineered responsive running shoe designed for high endurance and city sprints.",
    description:
      "Experience endless energy return with each stride. Features a seamless Primeknit upper, Continental rubber outsole for wet and dry grip, and precision-tuned torsion support system.",
    price: 139.9,
    originalPrice: 160.0,
    sizes: ["40", "41", "42", "43"],
    colors: ["gray", "pink"],
    images: {
      gray: "/products/7g.png",
      pink: "/products/7p.png",
    },
    rating: 4.8,
    reviewsCount: 92,
    isFeatured: true,
    inStock: true,
  },
  {
    id: 8,
    name: "Levi’s Classic Denim",
    category: "accessories",
    shortDescription: "Timeless straight-fit denim craftsmanship with durable reinforced rivets.",
    description:
      "The blueprint for every pair of modern jeans. Built from premium heavyweight cotton denim with signature five-pocket styling, authentic leather patch on back waistband, and contrast topstitching.",
    price: 59.9,
    originalPrice: 79.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["blue", "green"],
    images: {
      blue: "/products/8b.png",
      green: "/products/8gr.png",
    },
    rating: 4.7,
    reviewsCount: 180,
    isFeatured: false,
    inStock: true,
  },
];

export const getProductById = (id: string | number) => {
  return products.find((p) => String(p.id) === String(id));
};

export const getRelatedProducts = (id: string | number, limit = 4) => {
  const current = getProductById(id);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => String(p.id) !== String(id))
    .sort((a) => (a.category === current.category ? -1 : 1))
    .slice(0, limit);
};
