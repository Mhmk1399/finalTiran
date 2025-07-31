"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
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
  const [startIndex, setStartIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideWidth = 320; // هر اسلاید ۳۲۰ پیکسل

  const fakeProducts: FakeProduct[] = [
    {
      id: 1,
      name: "محصول شماره ۱",
      price: "۱,۲۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#000", "#fff", "#ff0000"],
    },
    {
      id: 2,
      name: "محصول شماره ۲",
      price: "۹۵۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#0000ff", "#00ff00"],
    },
    {
      id: 3,
      name: "محصول شماره ۳",
      price: "۱,۵۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#ffff00", "#ff00ff", "#00ffff"],
    },
    {
      id: 4,
      name: "محصول شماره ۴",
      price: "۸۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#808080", "#ffa500"],
    },
    {
      id: 5,
      name: "محصول شماره ۵",
      price: "۲,۱۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#800080", "#008000", "#ffc0cb"],
    },
    {
      id: 6,
      name: "محصول شماره ۶",
      price: "۱,۳۵۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#a52a2a", "#dda0dd"],
    },
    {
      id: 7,
      name: "محصول شماره ۷",
      price: "۱,۷۵۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#40e0d0", "#ee82ee", "#90ee90"],
    },
    {
      id: 8,
      name: "محصول شماره ۸",
      price: "۱,۰۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#f0e68c", "#deb887"],
    },
    {
      id: 9,
      name: "محصول شماره ۹",
      price: "۲,۵۰۰,۰۰۰",
      image: "/assets/images/aboutsec2.png",
      colors: ["#dc143c", "#00ced1", "#ff1493"],
    },
    {
      id: 10,
      name: "محصول شماره ۱۰",
      price: "۱,۸۰۰,۰۰۰",
      image: "/assets/images/aboutHero.png",
      colors: ["#4169e1", "#32cd32"],
    },
  ];

  const getLoopedProducts = () => {
    const total = fakeProducts.length;
    const result = [];
    for (let i = -1; i <= 1; i++) {
      result.push(fakeProducts[(startIndex + i + total) % total]);
    }
    return result;
  };

  useEffect(() => {
    const xOffset = -slideWidth;
    gsap.to(sliderRef.current, {
      x: xOffset,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [startIndex]);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % fakeProducts.length);
  };

  const prevSlide = () => {
    setStartIndex(
      (prev) => (prev - 1 + fakeProducts.length) % fakeProducts.length
    );
  };

  const visibleSlides = getLoopedProducts();

  return (
    <div className="w-full py-12" dir="rtl">
      <div className=" mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl mb-4 ${AriaBold.className}`}>
            {title}
          </h2>
          <p className={`${maneli.className} text-gray-500`}>
            جایی که در آن زیبایی ، کاربرد و پایداری در کنار هم قرار گرفته اند
          </p>
        </div>

        <div className="relative h-[450px] overflow-hidden flex justify-center items-center">
          <div
            ref={sliderRef}
            className="flex"
            style={{ width: slideWidth * 3 }}
          >
            {visibleSlides.map((product, index) => {
              const isCenter = index === 1;
              return (
                <div
                  key={`${product.id}-${index}`}
                  className={`transition-all duration-500 flex-shrink-0 w-[300px] h-[380px] mx-2 rounded-xl overflow-hidden ${
                    isCenter
                      ? "scale-110 opacity-100 z-10"
                      : "scale-90 opacity-60"
                  }`}
                >
                  <Link
                    href={`/shop/${product.id}`}
                    className="relative block w-full h-[75%]"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </Link>

                  {isCenter && (
                    <div className="text-center px-4 mt-2">
                      <h3 className={`text-lg ${AriaBold.className}`}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-black mt-1">
                        {product.price} تومان
                      </p>
                      <div className="flex justify-center gap-2 mt-2">
                        {product.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-400"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-30"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlideFendi;
