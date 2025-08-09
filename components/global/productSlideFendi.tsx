"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { maneli } from "@/next-persian-fonts/maneli";

interface ProductSlideshowProps {
  title: string;
}

interface FakeProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  colors: string[];
}

const ProductSlideFendi: React.FC<ProductSlideshowProps> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fakeProducts: FakeProduct[] = [
    {
      id: 1,
      name: "Peekaboo Mini",
      price: "۱,۲۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#8B4513", "#D2B48C", "#000"],
    },
    {
      id: 2,
      name: "Classic Bag",
      price: "۹۵۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#8B4513", "#D2B48C"],
    },
    {
      id: 3,
      name: "Luxury Handbag",
      price: "۱,۵۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#000", "#8B4513"],
    },
    {
      id: 4,
      name: "Designer Bag",
      price: "۸۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#8B4513", "#D2B48C", "#000"],
    },
    {
      id: 5,
      name: "Premium Collection",
      price: "۲,۱۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#000", "#8B4513"],
    },
    {
      id: 6,
      name: "Elegant Style",
      price: "۱,۳۵۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#8B4513", "#D2B48C"],
    },
    {
      id: 7,
      name: "Fashion Forward",
      price: "۱,۷۵۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#000", "#8B4513", "#D2B48C"],
    },
    {
      id: 8,
      name: "Signature Piece",
      price: "۱,۰۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#8B4513", "#000"],
    },
    {
      id: 9,
      name: "Limited Edition",
      price: "۲,۵۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#000", "#8B4513", "#D2B48C"],
    },
    {
      id: 10,
      name: "Exclusive Design",
      price: "۱,۸۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#8B4513", "#D2B48C"],
    },
  ];

  const getVisibleProducts = (index = currentIndex) => {
    return [
      fakeProducts[(index - 2 + fakeProducts.length) % fakeProducts.length],
      fakeProducts[(index - 1 + fakeProducts.length) % fakeProducts.length],
      fakeProducts[index],
      fakeProducts[(index + 1) % fakeProducts.length],
      fakeProducts[(index + 2) % fakeProducts.length],
    ];
  };

  const animateSlide = (newIndex: number, direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "expo.inOut",
      },
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      },
    });

    productRefs.current.forEach((card, i) => {
      if (card) {
        const currentX = (i - 2) * 500;
        const newX = direction === "next" ? currentX - 500 : currentX + 500;
        const willBeCenter = direction === "next" ? i === 3 : i === 1;

        tl.to(
          card,
          {
            x: newX,
            scale: willBeCenter ? 1.2 : 0.8,
            opacity: willBeCenter ? 1 : 0.6,
            filter: "blur(0px)",
          },
          i * 0.08 // افکت موجی آرام
        );
      }
    });
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % fakeProducts.length;
    animateSlide(newIndex, "next");
  };

  const prevSlide = () => {
    const newIndex =
      (currentIndex - 1 + fakeProducts.length) % fakeProducts.length;
    animateSlide(newIndex, "prev");
  };

  useEffect(() => {
    // انیمیشن اولیه
    productRefs.current.forEach((card, i) => {
      if (card) {
        const targetX = (i - 2) * 500;
        const isCenter = i === 2;

        gsap.fromTo(
          card,
          {
            x: targetX + 100,
            scale: 0.8,
          },
          {
            x: targetX,
            opacity: isCenter ? 1 : 0.7,
            scale: isCenter ? 1.2 : 0.8,
            ease: "expo.out",
            duration: 1.2,
          }
        );
      }
    });
  }, []);

  const visibleProducts = getVisibleProducts();
  const centerProduct = visibleProducts[2];

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
            disabled={isAnimating}
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
            disabled={isAnimating}
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
              const position = index - 2; // -2, -1, 0, 1, 2
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
                  <Link href={`/shop/${product.id}`}>
                    <div className="w-[320px] h-[350px] bg-white shadow-lg  overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority={isCenter}
                      />
                      {isCenter && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* اطلاعات محصول مرکزی */}
        <div className="text-center mt-8 space-y-4">
          <h3
            className={`text-2xl ${AriaBold.className} text-black transition-all duration-300`}
          >
            {centerProduct.name}
          </h3>
          <p className="text-xl font-semibold text-gray-700">
            {centerProduct.price} تومان
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {centerProduct.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="flex md:hidden justify-center gap-8 mt-8">
          <button
            onClick={prevSlide}
            disabled={isAnimating}
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
            disabled={isAnimating}
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
