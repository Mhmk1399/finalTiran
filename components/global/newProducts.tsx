"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AriaBold } from "@/next-persian-fonts/woff2";

interface ApiResponse {
  success: boolean;
  data: {
    items: Product[];
    _links: {
      self: { href: string };
      first: { href: string };
      last: { href: string };
    };
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}

interface ProductGridProps {
  title: string;
  description: string;
  endpoint: string;
  category?: string;
  className?: string;
}

// Image Slider Component
const ProductImageSlider: React.FC<{
  images: Array<{ id: number; src: string }>;
  productTitle: string;
  mainImageId?: number;
}> = ({ images, productTitle, mainImageId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Set initial image to main image if available
  useEffect(() => {
    if (mainImageId) {
      const mainImageIndex = images.findIndex((img) => img.id === mainImageId);
      if (mainImageIndex !== -1) {
        setCurrentImageIndex(mainImageIndex);
      }
    }
  }, [images, mainImageId]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">تصویر موجود نیست</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-square bg-gray-50 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <Image
        src={images[currentImageIndex]?.src || ""}
        alt={`${productTitle} - تصویر ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-all duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Navigation Arrows - Show only if more than 1 image and on hover */}
      {images.length > 1 && isHovered && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8  hover:bg-white/30 rounded-full flex items-center justify-center  transition-all duration-200 z-10"
            aria-label="تصویر قبلی"
          >
            <ChevronLeft size={22} className="text-white font-bold" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8  hover:bg-white/30 rounded-full flex items-center justify-center  transition-all duration-200 z-10"
            aria-label="تصویر بعدی"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-opacity-10 transition-all duration-300" />
    </div>
  );
};

const NewProductRow: React.FC<ProductGridProps> = ({
  title,
  // description,
  endpoint,
  category,
  className = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse: ApiResponse = await response.json();

        if (!apiResponse.success) {
          throw new Error("API returned unsuccessful response");
        }

        if (!apiResponse.data || !Array.isArray(apiResponse.data.items)) {
          throw new Error("Invalid data structure received from API");
        }

        let productsArray = apiResponse.data.items;

        // Filter by parent category if provided
        if (category) {
          productsArray = productsArray.filter((product) => {
            if (product.variety && product.variety.category) {
              const productCategory = product.variety.category;

              if (
                productCategory.cat_name
                  .toLowerCase()
                  .includes(category.toLowerCase()) ||
                productCategory.cat_en_name
                  .toLowerCase()
                  .includes(category.toLowerCase())
              ) {
                return true;
              }

              if (productCategory.parent) {
                return (
                  productCategory.parent.cat_name
                    .toLowerCase()
                    .includes(category.toLowerCase()) ||
                  productCategory.parent.cat_en_name
                    .toLowerCase()
                    .includes(category.toLowerCase())
                );
              }
            }

            if (product.varieties && product.varieties.length > 0) {
              return product.varieties.some((variety) => {
                if (variety.category) {
                  const varietyCategory = variety.category;

                  if (
                    varietyCategory.cat_name
                      .toLowerCase()
                      .includes(category.toLowerCase()) ||
                    varietyCategory.cat_en_name
                      .toLowerCase()
                      .includes(category.toLowerCase())
                  ) {
                    return true;
                  }

                  if (varietyCategory.parent) {
                    return (
                      varietyCategory.parent.cat_name
                        .toLowerCase()
                        .includes(category.toLowerCase()) ||
                      varietyCategory.parent.cat_en_name
                        .toLowerCase()
                        .includes(category.toLowerCase())
                    );
                  }
                }
                return false;
              });
            }

            return false;
          });
        }

        const finalProducts = productsArray.slice(0, 6);
        setProducts(finalProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching products"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchProducts();
    }
  }, [endpoint, category]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    return new Intl.NumberFormat("fa-IR").format(numPrice);
  };

  const getProductPrice = (product: Product): string | number => {
    if (product.variety && product.variety.price_final) {
      return product.variety.price_final;
    }

    if (product.varieties && product.varieties.length > 0) {
      const mainVariety =
        product.varieties.find((v) => v.is_main) || product.varieties[0];
      return mainVariety.price_main;
    }

    return "0";
  };

  const getProductTitle = (product: Product): string => {
    return product.fa_name || product.en_name || `محصول ${product.id}`;
  };

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">خطا در بارگذاری محصولات</p>
          <p className="text-gray-400 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full py-24 md:py-28 lg:py-32 relative ${className}`}
      dir="rtl"
      style={{
        background: `url('/assets/images/texture.png')`,
      }}
    >
      {/* Top Vertical Line - Coming down 30px from top */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-b from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      >
        {/* Decorative bottom dot */}
      </motion.div>

      {/* Bottom Vertical Line - Coming up 30px from bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-t from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to top, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      >
        {/* Decorative top dot */}
      </motion.div>

      <div className="px-4 relative z-20">
        {/* Title and Description Section */}
        <div className="w-full flex flex-col items-center text-center justify-center mb-8">
          <div className="space-y-4">
            <h2
              className={`text-2xl md:text-[32px]   ${AriaBold.className} text-black mb-2 tracking-wide`}
            >
              {title}
            </h2>
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="w-fit h-full">
                <img
                  src="/assets/images/newProductrow.png" // Replace with your actual image path
                  alt="دسته بندی محصولات"
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Products Grid Section */}
          <div className="w-full">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="w-full aspect-square bg-gray-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 animate-pulse" />
                      <div className="h-4 bg-gray-100 animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const productPrice = getProductPrice(product);
                  const productTitle = getProductTitle(product);

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group block transition-all duration-300 hover:transform"
                    >
                      <div className="space-y-3">
                        {/* Product Image Slider */}
                        <ProductImageSlider
                          images={product.images}
                          productTitle={productTitle}
                          mainImageId={product.main_image_id ?? undefined}
                        />

                        {/* Product Info */}
                        <div className="space-y-3 flex items-center justify-between">
                          <div>
                            {" "}
                            <h3
                              className={`"text-black  ${AriaBold.className} text-sm lg:text-base line-clamp-2 group-hover:text-gray-700 transition-colors duration-300"`}
                            >
                              {productTitle}
                            </h3>
                            <p
                              className="text-black font-semibold text-sm lg:text-base"
                              dir="rtl"
                            >
                              {productPrice === "0" || productPrice === 0 ? (
                                <span className="text-gray-500" dir="rtl">
                                  تماس بگیرید
                                </span>
                              ) : (
                                `${formatPrice(productPrice)} تومان`
                              )}
                            </p>
                          </div>
                          <div>
                            <Image
                              src="/assets/images/Arrow.png"
                              alt="Arrow Icon"
                              width={400}
                              height={400}
                              className="w-10 h-2.5  transition-colors duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">محصولی یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductRow;
