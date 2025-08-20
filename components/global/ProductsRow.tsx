"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  showLoadMore?: boolean;
  filters?: {
    categories: string[];
    colors: string[];
    available: boolean;
  };
}

interface PaginationMeta {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  perPage: number;
}

// Image Slider Component
const ProductImageSlider: React.FC<{
  images: Array<{ id: number; src: string }>;
  productTitle: string;
  mainImageId?: number;
}> = ({ images, productTitle, mainImageId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // const goToImage = (index: number, e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setCurrentImageIndex(index);
  // };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">تصویر موجود نیست</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-gray-50 overflow-hidden group">
      {/* Main Image */}
      <Image
        src={images[currentImageIndex]?.src || ""}
        alt={`${productTitle} - تصویر ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-all duration-300"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Navigation Arrows - Show only if more than 1 image and on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:opacity-0 group-hover:opacity-100  hover:bg-white/30 rounded-full flex items-center justify-center  transition-all duration-200 z-10"
            aria-label="تصویر قبلی"
          >
            <ChevronLeft size={22} className="text-white font-bold" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:opacity-0 group-hover:opacity-100 hover:bg-white/30 rounded-full flex items-center justify-center  transition-all duration-200 z-10"
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

const ProductRow: React.FC<ProductGridProps> = ({
  title,
  description,
  endpoint,
  category,
  className = "",
  showLoadMore = false,
  filters,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const url = `${endpoint}${
        endpoint.includes("?") ? "&" : "?"
      }page=${page}`;
      const response = await fetch(url);

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

      // Filter products that have variety and variety is not null
      productsArray = productsArray.filter((product) => 
        product.variety !== null && product.variety !== undefined
      );

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

      // Apply filters
      let filteredProducts = productsArray;
      if (filters) {
        filteredProducts = productsArray.filter((product) => {
          // Category filter
          if (filters.categories.length > 0) {
            const productCategory = product.variety?.category;
            if (!productCategory) return false;

            const categoryMatch = filters.categories.some(
              (catId) =>
                productCategory.id.toString() === catId ||
                productCategory.parent?.id.toString() === catId
            );
            if (!categoryMatch) return false;
          }

          // Color filter
          if (filters.colors.length > 0) {
            const productColors =
              product.variety?.Properties?.filter(
                (prop) => prop.property_id === "color"
              ) || [];
            if (productColors.length === 0) return false;

            const colorMatch = productColors.some((colorProp) =>
              filters.colors.includes(colorProp.title.toLowerCase())
            );
            if (!colorMatch) return false;
          }

          // Available filter
          if (filters.available && product.store_stock <= 0) {
            return false;
          }

          return true;
        });
      }

      const finalProducts = showLoadMore
        ? filteredProducts
        : filteredProducts.slice(0, 6);

      if (append) {
        setProducts((prev) => [...prev, ...finalProducts]);
      } else {
        setProducts(finalProducts);
      }

      setPagination(apiResponse.data._meta);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      );
      if (!append) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (endpoint) {
      fetchProducts(1, false);
    }
  }, [endpoint, category, filters]);

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.pageCount) {
      fetchProducts(currentPage + 1, true);
    }
  };

  const shouldShowLoadMore =
    showLoadMore &&
    pagination &&
    pagination.totalCount > 20 &&
    currentPage < pagination.pageCount;

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
    <div className={`w-full py-5 ${className}`} dir="rtl">
      <div className="px-4">
        {/* Title and Description Section */}
        <div className="w-full flex flex-col justify-center mb-8">
          <div className="space-y-4">
            <h2
              className={`text-2xl flex gap-2 lg:text-[32px] text-black leading-tight  ${AriaBold.className} `}
            >
              <span>█ </span>
              {title}
            </h2>
            <p className="text-gray-400 text-base lg:text-base leading-relaxed">
              {description}
            </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
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
                        <div className="space-y-2">
                          <h3
                            className={`text-black ${AriaBold.className} text-sm lg:text-base line-clamp-2 group-hover:text-gray-700 transition-colors duration-300`}
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
                          <div className="flex gap-1 justify-end flex-wrap">
                            {product.variety?.Properties?.filter(
                              (prop) => prop.property_id === "color"
                            ).map((colorProp, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                style={{
                                  backgroundColor: colorProp.code || "#ccc",
                                }}
                                title={`${colorProp.title} (${colorProp.code})`}
                              />
                            ))}
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

            {/* Load More Button */}
            {shouldShowLoadMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-black cursor-pointer text-white px-8 py-3 hover:bg-transparent hover:text-black hover:font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingMore ? "در حال بارگذاری..." : "مشاهده بیشتر"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;
