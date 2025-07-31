"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/type";
import { AriaBold } from "@/next-persian-fonts/woff2";

interface ProductSlideshowProps {
  title: string;
  endpoint: string;
  category?: string;
  className?: string;
}

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

const ProductSlideFendi: React.FC<ProductSlideshowProps> = ({
  title,
  endpoint,
  category = "",
  className = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const getProductColors = (product: Product): string[] => {
    if (product.varieties && product.varieties.length > 0) {
      return product.varieties
        .map((v) => v.color_code)
        .filter(Boolean)
        .slice(0, 4); // Show max 4 colors
    }
    return [];
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(products.length / 3)) %
        Math.ceil(products.length / 3)
    );
  };

  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * 3;
    return products.slice(startIndex, startIndex + 3);
  };

  if (loading) {
    return (
      <div className={`w-full py-16 ${className}`}>
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className={`w-full py-16 ${className}`}>
        <div className="text-center">
          <p className="text-gray-500">محصولی یافت نشد</p>
        </div>
      </div>
    );
  }

  const slideProducts = getCurrentSlideProducts();
  const centerProductIndex = 1; // Middle product (index 1 of 3)

  return (
    <div className={`w-full bg-red-600 py-8 `} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl ${AriaBold.className} text-black`}
          >
            {title}
          </h2>
        </div>

        {/* Products Slideshow */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
            >
              {slideProducts.map((product, index) => {
                const isCenter = index === centerProductIndex;
                const productPrice = getProductPrice(product);
                const productTitle = getProductTitle(product);
                const productColors = getProductColors(product);

                return (
                  <motion.div
                    key={product.id}
                    className={`relative transition-all duration-300 ${
                      isCenter ? "scale-110 z-10" : "scale-95 opacity-75"
                    }`}
                    whileHover={{ scale: isCenter ? 1.15 : 1 }}
                  >
                    <Link href={`/shop/${product.slug}`} className="block">
                      <div className="space-y-4">
                        {/* Product Image */}
                        <div className="relative overflow-hidden rounded-lg">
                          <Image
                            src={
                              typeof product.images[1] === "string"
                                ? product.images[1]
                                : product.images[1]?.src
                            }
                            alt={"dwwd"}
                            width={800}
                            height={800}
                          />
                        </div>

                        {/* Product Info - Only show for center product */}
                        <AnimatePresence>
                          {isCenter && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className="text-center space-y-3"
                            >
                              <h3
                                className={`text-lg ${AriaBold.className} text-black`}
                              >
                                {productTitle}
                              </h3>

                              <p className="text-black font-semibold">
                                {productPrice === "0" || productPrice === 0 ? (
                                  <span className="text-gray-500">
                                    تماس بگیرید
                                  </span>
                                ) : (
                                  `${formatPrice(productPrice)} تومان`
                                )}
                              </p>

                              {/* Color Options */}
                              {productColors.length > 0 && (
                                <div className="flex justify-center gap-2 mt-3">
                                  {productColors.map((color, colorIndex) => (
                                    <div
                                      key={colorIndex}
                                      className="w-4 h-4 rounded-full border-2 border-gray-300"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all z-20"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all z-20"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlideFendi;
