"use client";
import { useState, useEffect } from "react";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
import ProductComments from "@/components/static/ProductComments";
import RelatedProducts from "@/components/static/RelatedProducts";
import { Product } from "@/types/type";
import Breadcrumbs from "../global/breadcrumbs";
import SmoothScrollProvider from "../global/smoothScrollProvider.tsx";

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
  const [isZoomed, setIsZoomed] = useState(false);

  // Lock scroll when zoom modal is open
  useEffect(() => {
    if (isZoomed) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isZoomed]);

  // Mobile scroll detection for active image
  useEffect(() => {
    if (isDesktop || !product) return;

    const handleScroll = () => {
      const images = document.querySelectorAll("[data-image-index]");
      let activeIndex = 0;
      let maxVisibility = 0;

      images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the image is visible
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;

        if (visibility > maxVisibility && visibility > 0.5) {
          maxVisibility = visibility;
          activeIndex = index;
        }
      });

      setActiveImageIndex(activeIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop, product]);

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
    productImages.length > 2 ? productImages.map((img) => img.src) : [];

  // Desktop Layout
  if (isDesktop) {
    return (
      <>
        {" "}
        <main className="min-h-screen relative bg-white py-20 px-20" dir="rtl">
          <div className="absolute top-28 right-20 z-20">
            {" "}
            <Breadcrumbs customTitle={product.fa_name || product.en_name} />
          </div>

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

              <div className="col-span-5 overflow-auto max-h-150 bg-white">
                <ProductGallery
                  primaryImage={primaryImage}
                  secondaryImage={secondaryImage}
                  additionalImages={additionalImages}
                  productName={product.fa_name}
                  layout="desktop"
                  activeImageIndex={activeImageIndex}
                  onThumbnailClick={setActiveImageIndex}
                  isZoomed={isZoomed}
                  setIsZoomed={setIsZoomed}
                />
              </div>

              <div className="col-span-6 max-w-4xl mr-4 bg-white">
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
        <SmoothScrollProvider />
      </>
    );
  }

  // Mobile Layout
  return (
    <>
      {" "}
      <main
        className="container relative mx-auto px-4 md:px-15 py-12"
        dir="rtl"
      >
        <div className="absolute -top-5 right-4 md:top-20 md:right-15 z-20">
          {" "}
          <Breadcrumbs customTitle={product.fa_name || product.en_name} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2  sm:mt-36 mt-15">
          <ProductGallery
            primaryImage={primaryImage}
            secondaryImage={secondaryImage}
            additionalImages={additionalImages}
            productName={product.fa_name}
            layout="mobile"
            activeImageIndex={activeImageIndex}
            onThumbnailClick={setActiveImageIndex}
            isZoomed={isZoomed}
            setIsZoomed={setIsZoomed}
          />

          <ProductInfo product={product} layout="mobile" />
        </div>

        <ProductComments productSlug={product.slug} productId={product.id} />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
      <SmoothScrollProvider />
    </>
  );
}
