import { getProductById, getRelatedProducts, products } from "@/data/products";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";
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
      title: "Product Not Found | NAHIAN's Store",
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
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id, 4);

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
};

export default ProductDetailPage;
