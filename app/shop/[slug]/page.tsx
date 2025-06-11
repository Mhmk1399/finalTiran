import ProductPageClient from "@/components/static/productPageClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>; // params is now a Promise
}

// Server-side function to fetch product data for metadata
async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          slug: slug,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Await params here
  const product = await getProduct(slug);
  if (!product) {
    return {
      title: "محصول یافت نشد | تیران",
      description: "محصول مورد نظر یافت نشد",
    };
  }

  return {
    title: `${product.fa_name} | تیران`,
    description:
      product.description || `خرید ${product.fa_name} از فروشگاه تیران`,
    openGraph: {
      title: product.fa_name,
      description:
        product.description || `خرید ${product.fa_name} از فروشگاه تیران`,
      images: product.images?.length > 0 ? [product.images[0].src] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.fa_name,
      description:
        product.description || `خرید ${product.fa_name} از فروشگاه تیران`,
      images: product.images?.length > 0 ? [product.images[0].src] : [],
    },
  };
}

// Server component that renders the client component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // Await params here
  return <ProductPageClient slug={slug} />;
}
