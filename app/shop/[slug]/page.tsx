import ProductPageClient from "@/components/static/productPageClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const API_BASE_URL =
  "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/product/view";

// Server-side function to fetch product data for metadata

async function getProduct(slug: string) {
  try {
    const fullUrl = `${API_BASE_URL}?slug=${slug}&expand=varieties,images`;

    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `❌ Failed to fetch product: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
      return {
        title: "محصول یافت نشد | تیران",
        description: "محصول مورد نظر یافت نشد.",
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
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "محصول یافت نشد | تیران",
      description: "محصول مورد نظر یافت نشد",
    };
  }
}

// Server component that renders the client component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
