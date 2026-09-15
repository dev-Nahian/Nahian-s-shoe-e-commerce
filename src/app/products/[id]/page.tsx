import ProductDetailView from "@/components/ProductDetailView";
import { getProductById, products } from "@/data/products";
import { Metadata } from "next";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Product Details | NAHIAN's Store",
    };
  }

  return {
    title: `${product.name} | NAHIAN's Store`,
    description: product.shortDescription,
  };
}

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <ProductDetailView id={id} />;
};

export default ProductDetailPage;
