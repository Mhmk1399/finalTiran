"use client";
import { useState, useEffect } from "react";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
import ProductComments from "@/components/static/ProductComments";
import RelatedProducts from "@/components/static/RelatedProducts";
import { Product } from "@/types/type";

interface ProductPageClientProps {
  slug: string;
}

export default function ProductPageClient({ slug }: ProductPageClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Check if desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/shop/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            slug: slug,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        const productData: Product = {
          ...data.data,
          images: data.data.images || [],
          varieties: data.data.varieties || [],
        };

        setProduct(productData);

        if (data.data.relatedProducts) {
          setRelatedProducts(data.data.relatedProducts);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(" خطا در بارگذاری محصول");
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Rest of your component logic remains the same...
  // (loading, error, desktop/mobile layouts)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-xl font-medium text-red-600 mt-36">
          {error || "Product not found"}
        </h3>
        <button
          title="بازگشت به فروشگاه"
          aria-label="back to shop"
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  // Prepare images for gallery
  const productImages = product.images || [];
  const primaryImage =
    productImages.length > 0
      ? productImages[0].src
      : "/assets/images/fashion/6.avif";
  const secondaryImage =
    productImages.length > 1 ? productImages[1].src : primaryImage;
  const additionalImages =
    productImages.length > 2
      ? productImages.slice(2).map((img) => img.src)
      : [];

  // Desktop Layout
  if (isDesktop) {
    return (
      <main className="min-h-screen bg-white py-10 mx-10" dir="rtl">
        {/* Your existing desktop layout */}
        <div className="min-h-screen mt-20">
          <div className="grid grid-cols-12 h-full gap-0">
            <div className="col-span-1 mt-6">
              <ProductGallery
                primaryImage={primaryImage}
                secondaryImage={secondaryImage}
                additionalImages={additionalImages}
                productName={product.fa_name}
                layout="thumbnails"
                activeImageIndex={activeImageIndex}
                onThumbnailClick={setActiveImageIndex}
              />
            </div>

            <div className="col-span-5 overflow-auto min-h-full bg-white">
              <ProductGallery
                primaryImage={primaryImage}
                secondaryImage={secondaryImage}
                additionalImages={additionalImages}
                productName={product.fa_name}
                layout="desktop"
                activeImageIndex={activeImageIndex}
                onImageChange={setActiveImageIndex}
              />
            </div>

            <div className="col-span-6 max-w-4xl mr-8 bg-white">
              <div className="h-full overflow-y-auto scrollbar-hide">
                <ProductInfo product={product} layout="desktop" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <ProductComments
              productSlug={product.slug}
              productId={product.id}
            />

            {relatedProducts.length > 0 && (
              <RelatedProducts products={relatedProducts} />
            )}
          </div>
        </div>
      </main>
    );
  }

  // Mobile Layout
  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2  sm:mt-36 mt-10">
        <ProductGallery
          primaryImage={primaryImage}
          secondaryImage={secondaryImage}
          additionalImages={additionalImages}
          productName={product.fa_name}
          layout="mobile"
        />

        <ProductInfo product={product} layout="mobile" />
      </div>

      <ProductComments productSlug={product.slug} productId={product.id} />

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
