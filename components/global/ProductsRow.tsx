"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { Product } from "@/types/type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { FiBox } from "react-icons/fi";

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
  categorySlug?: string;
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

const fetcher = async (url: string) => {
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
  return apiResponse;
};

const useProductsData = ({
  endpoint,
  categorySlug,
  showLoadMore,
  isVisible,
}: {
  endpoint: string;
  categorySlug?: string;
  showLoadMore?: boolean;
  isVisible: boolean;
}) => {
  const getKey = (pageIndex: number, previousPageData: ApiResponse | null) => {
    if (!isVisible) return null;
    if (previousPageData && !previousPageData.data.items.length) return null;
    if (!showLoadMore && pageIndex > 0) return null;

    let url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${
      pageIndex + 1
    }`;
    if (categorySlug) {
      url += `&category_slug=${categorySlug}`;
    }
    return url;
  };

  return useSWRInfinite<ApiResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
  });
};

const ProductImageSlider: React.FC<{
  images: Array<{ id: number; src: string }>;
  productTitle: string;
  mainImageId?: number;
}> = ({ images, productTitle, mainImageId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Set initial image to main image if available
  useEffect(() => {
    if (mainImageId) {
      const mainImageIndex = images.findIndex((img) => img.id === mainImageId);
      if (mainImageIndex !== -1) {
        setCurrentImageIndex(mainImageIndex);
      }
    }
  }, [images, mainImageId]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    nextImageAction();
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImageAction = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImageAction = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImageAction();
    }
    if (isRightSwipe) {
      prevImageAction();
    }
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
    <div
      className="relative w-full aspect-square bg-gray-50 overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:opacity-0 group-hover:opacity-100  hover:bg-white/30 flex items-center justify-center  transition-all duration-200 z-10"
            aria-label="تصویر قبلی"
          >
            <ChevronLeft size={22} className="text-white font-bold" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:opacity-0 group-hover:opacity-100 hover:bg-white/30 flex items-center justify-center  transition-all duration-200 z-10"
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
  categorySlug,
  className = "",
  showLoadMore = false,
  filters,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (rootRef.current) {
      observer.observe(rootRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const {
    data,
    error: swrError,
    isLoading,
    isValidating,
    size,
    setSize,
  } = useProductsData({
    endpoint,
    categorySlug,
    showLoadMore,
    isVisible,
  });

  const allItems = useMemo(() => {
    if (!data) return [];

    return data.flatMap((apiResponse) => {
      let productsArray = apiResponse.data.items.filter(
        (product) => product.variety !== null && product.variety !== undefined
      );

      // Filter by category
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

      // Filter by other filters
      let filteredProducts = productsArray;
      if (filters) {
        filteredProducts = productsArray.filter((product) => {
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

          if (filters.available && product.store_stock <= 0) {
            return false;
          }

          return true;
        });
      }

      return filteredProducts;
    });
  }, [data, category, filters]); // فقط وقتی یکی از اینا تغییر کنه دوباره محاسبه میشه

  const displayedProducts = showLoadMore ? allItems : allItems.slice(0, 6);

  const pagination: PaginationMeta | null =
    data?.[data.length - 1]?.data._meta || null;

  const shouldShowLoadMore =
    showLoadMore &&
    pagination &&
    pagination.totalCount > 8 &&
    size < pagination.pageCount;

  const handleLoadMore = () => {
    setSize(size + 1);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    return new Intl.NumberFormat("fa-IR").format(numPrice);
  };

  const getProductPrice = (product: Product): string | number => {
    if (product.variety && product.variety.price_main) {
      return product.variety.price_main;
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

  if (swrError) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">خطا در بارگذاری محصولات</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`w-full py-5 ${className}`} dir="rtl">
      <div className="px-4">
        {/* Title and Description Section */}
        <div className="w-full flex flex-col justify-center mb-8">
          <div className="space-y-4">
            <h2
              className={`text-2xl flex gap-2 lg:text-[32px] text-black leading-tight  ${AriaBold.className} `}
            >
              <span>█</span>
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
            {!data || isLoading ? (
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
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {displayedProducts.map((product, idx) => {
                  const productPrice = getProductPrice(product);
                  const productTitle = getProductTitle(product);

                  return (
                    <Link
                      key={product.id + "-" + idx}
                      href={`/shop/${product.slug}`}
                      target="_blank"
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
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FiBox className="text-5xl mb-3" />
                <p className="text-base font-medium">محصولی یافت نشد</p>
              </div>
            )}

            {/* Load More Button */}
            {shouldShowLoadMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isValidating}
                  className="bg-black cursor-pointer text-white px-8 py-3 hover:bg-transparent hover:text-black hover:font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isValidating ? "در حال بارگذاری..." : "مشاهده بیشتر"}
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
