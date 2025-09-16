"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { maneli } from "@/next-persian-fonts/maneli";
import { Product } from "@/types/type";
import { useProducts } from "@/hooks/useProductsFendi";

interface ProductSlideshowProps {
  title: string;
}

const ProductSlideFendi: React.FC<ProductSlideshowProps> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitioning, setTransitioning] = useState<"next" | "prev" | null>(
    null
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { products, isLoading: loading, error } = useProducts("/api/shop", 9);

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    const len = products.length;
    const base = [
      products[(currentIndex - 2 + len) % len],
      products[(currentIndex - 1 + len) % len],
      products[currentIndex],
      products[(currentIndex + 1) % len],
      products[(currentIndex + 2) % len],
    ];
    if (transitioning === "next") {
      return [...base, products[(currentIndex + 3 + len) % len]];
    } else if (transitioning === "prev") {
      return [products[(currentIndex - 3 + len) % len], ...base];
    }
    return base;
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    return new Intl.NumberFormat("fa-IR").format(numPrice);
  };

  const getProductPrice = (product: Product): string => {
    if (product.variety?.price_main) {
      return formatPrice(product.variety.price_main);
    }
    if (product.varieties?.[0]?.price_main) {
      return formatPrice(product.varieties[0].price_main);
    }
    return "تماس بگیرید";
  };

  const getProductTitle = (product: Product): string => {
    return product.fa_name || product.en_name || `محصول ${product.id}`;
  };

  const getProductImage = (product: Product): string => {
    return product.images?.[0]?.src || "/assets/images/aboutsec2.png";
  };

  const getProductColors = (product: Product): string[] => {
    return (
      product.variety?.Properties?.filter(
        (prop) => prop.property_id === "color"
      ).map((prop) => prop.code || "#ccc") || ["#8B4513"]
    );
  };

  useEffect(() => {
    if (transitioning) {
      const direction = transitioning;
      const len = products.length;
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % len
          : (currentIndex - 1 + len) % len;

      const tl = gsap.timeline({
        defaults: {
          duration: 0.6,
          ease: "sine.inOut",
        },
        onComplete: () => {
          setCurrentIndex(newIndex);
          setTransitioning(null);
          setIsAnimating(false);
        },
      });

      productRefs.current.forEach((card, i) => {
        if (card) {
          const offset = direction === "prev" ? 3 : 2;
          const current_pos = i - offset;
          const pos_shift = direction === "next" ? -1 : 1;
          const target_pos = current_pos + pos_shift;
          const target_x = target_pos * 500;
          const target_scale = target_pos === 0 ? 1.2 : 0.8;
          const target_opacity = target_pos === 0 ? 1 : 0.7;

          tl.to(
            card,
            {
              x: target_x,
              scale: target_scale,
              opacity: target_opacity,
              filter: "blur(0px)",
            },
            i * 0.02 // Further reduced stagger for faster, smoother transition
          );
        }
      });
    }
  }, [transitioning, products, currentIndex]);

  const nextSlide = () => {
    if (products.length === 0 || isAnimating) return;
    setTransitioning("next");
    setIsAnimating(true);
  };

  const prevSlide = () => {
    if (products.length === 0 || isAnimating) return;
    setTransitioning("prev");
    setIsAnimating(true);
  };

  useEffect(() => {
    if (products.length > 0 && !transitioning) {
      productRefs.current.forEach((card, i) => {
        if (card) {
          const targetX = (i - 2) * 500;
          const isCenter = i === 2;

          gsap.fromTo(
            card,
            {
              x: targetX + 100,
              scale: 0.8,
              opacity: 0.7,
            },
            {
              x: targetX,
              opacity: isCenter ? 1 : 0.7,
              scale: isCenter ? 1.2 : 0.8,
              ease: "expo.out",
              duration: 0.8, // Reduced initial animation duration for quicker setup
            }
          );
        }
      });
    }
  }, [products]);

  const visibleProducts = getVisibleProducts();
  const centerProduct =
    visibleProducts[Math.floor(visibleProducts.length / 2)] ||
    visibleProducts[2];

  // skeleton loading
  if (loading || error) {
    return (
      <div className="w-full py-24 md:py-28 lg:py-32 relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4">
          <div className="text-center mb-4">
            <div className="h-8 w-48 mx-auto bg-gray-200 animate-pulse "></div>
            <div className="h-4 w-64 mx-auto mt-2 bg-gray-200 animate-pulse "></div>
          </div>
          <div className="relative h-[450px] flex justify-center items-center overflow-hidden">
            {[...Array(5)].map((_, index) => {
              const position = index - 2;
              const translateX = position * 500;
              const isCenter = position === 0;
              return (
                <div
                  key={`skeleton-${index}`}
                  className="product-card absolute will-change-transform"
                  style={{
                    transform: `translateX(${translateX}px) scale(${
                      isCenter ? 1.2 : 0.8
                    })`,
                    zIndex: isCenter ? 10 : 5 - Math.abs(position),
                    opacity: isCenter ? 1 : 0.7,
                    transformOrigin: "center center",
                  }}
                >
                  <div className="w-[300px] h-[300px] bg-gray-200 animate-pulse shadow-lg"></div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8 space-y-4">
            <div className="h-6 w-40 mx-auto bg-gray-200 animate-pulse "></div>
            <div className="h-5 w-24 mx-auto bg-gray-200 animate-pulse "></div>
            <div className="flex justify-center gap-3 mt-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={`color-${index}`}
                  className="w-4 h-4 rounded-full bg-gray-200 animate-pulse border-2 border-gray-300"
                />
              ))}
            </div>
          </div>
          <div className="flex md:hidden justify-center gap-8 mt-8">
            <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  // empty state
  if (products.length === 0) {
    return (
      <div className="w-full py-24 md:py-28 lg:py-32 flex justify-center items-center">
        <p className="text-gray-500">محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="w-full py-24 md:py-28 lg:py-32 relative overflow-hidden">
      {/* خطوط تزئینی بالا و پایین */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-b from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-t from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to top, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      />

      <div className="max-w-8xl mx-auto px-4">
        <div className="text-center mb-4">
          <h2
            className={`text-3xl mb-4 md:text-4xl ${AriaBold.className} text-black`}
          >
            {title}
          </h2>
          <div className=" text-center">
            <p className={` ${maneli.className} text-gray-500 `}>
              زیبایی ، کاربرد و پایداری در کنار هم قرار گرفته اند{" "}
            </p>
          </div>
        </div>

        {/* اسلایدر محصولات */}
        <div className="relative">
          {/* Left Navigation Button - Desktop Only */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14  backdrop-blur-sm  transition-all duration-300 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Navigation Button - Desktop Only */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14  backdrop-blur-sm  transition-all duration-300 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            ref={sliderRef}
            className="relative h-[450px] flex justify-center items-center overflow-hidden"
          >
            {visibleProducts.map((product, index) => {
              const offset = transitioning === "prev" ? 3 : 2;
              const position = index - offset;
              const translateX = position * 500;
              const isCenter = position === 0;
              return (
                <div
                  ref={(el) => {
                    productRefs.current[index] = el;
                  }}
                  key={`product-${product.id}`}
                  className="product-card absolute will-change-transform"
                  style={{
                    transform: `translateX(${translateX}px) scale(${
                      isCenter ? 1.2 : 0.8
                    })`,
                    zIndex: isCenter ? 10 : 5 - Math.abs(position),
                    opacity: isCenter ? 1 : 0.7,
                    transformOrigin: "center center",
                  }}
                >
                  <Link href={`/shop/${product.slug}`}>
                    <div
                      className={`w-[300px] h-[300px] bg-white shadow-lg  overflow-hidden ${
                        !isCenter ? "hover:shadow-2xl" : ""
                      } transition-all duration-300 relative`}
                    >
                      <Image
                        src={getProductImage(product)}
                        alt={getProductTitle(product)}
                        fill
                        className="object-cover"
                        priority={isCenter}
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* اطلاعات محصول مرکزی */}
        {centerProduct && (
          <div className="text-center   space-y-4">
            <h3
              className={`text-base  md:text-xl ${AriaBold.className} text-black transition-all duration-300`}
            >
              {getProductTitle(centerProduct)}
            </h3>
            <p className="text-sm md:text-lg font-semibold text-gray-700">
              {getProductPrice(centerProduct)}{" "}
              {getProductPrice(centerProduct) !== "تماس بگیرید" ? "تومان" : ""}
            </p>
            <div className="flex justify-center gap-3 mt-4">
              {getProductColors(centerProduct).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden justify-center gap-8 ">
          <button
            onClick={prevSlide}
            className="w-12 h-12  transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12  transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlideFendi;
