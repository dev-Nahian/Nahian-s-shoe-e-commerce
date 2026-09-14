import ProductList from "@/components/ProductList";
import HeroBanner from "@/components/HeroBanner";
import Perks from "@/components/Perks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NAHIAN's Store | Modern Performance & Lifestyle Apparel",
  description: "Explore premium sport essentials, high-performance shoes, and lifestyle apparel engineered for comfort and peak endurance.",
};

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const search = resolvedParams.search;
  const sort = resolvedParams.sort;

  return (
    <div className="py-2">
      {/* HERO BANNER */}
      {!category && !search && <HeroBanner />}

      {/* PRODUCT LIST */}
      <ProductList
        category={category}
        search={search}
        sort={sort}
        params="homepage"
      />

      {/* TRUST FACTORS & PERKS */}
      <Perks />
    </div>
  );
};

export default Homepage;
