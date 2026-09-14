import ProductList from "@/components/ProductList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products | NAHIAN's Store",
  description: "Browse our entire collection of athletic apparel, premium shoes, and everyday sportswear.",
};

const ProductPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) => {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const search = resolvedParams.search;
  const sort = resolvedParams.sort;

  return (
    <div className="py-4">
      <ProductList
        category={category}
        search={search}
        sort={sort}
        params="products"
      />
    </div>
  );
};

export default ProductPage;
