"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";
import gsap from "gsap";
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

  // رفرنس برای هر اسلاید که انیمیشن بخوره
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const getVisibleProducts = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(fakeProducts[(startIndex + i) % fakeProducts.length]);
    }
    return items;
  };

  // انیمیشن با GSAP روی تغییر startIndex
  useEffect(() => {
    const slides = slidesRef.current;

    slides.forEach((slide, index) => {
      if (!slide) return;

      const isCenter = index === 1;

      // موقعیت x در حالت ثابت، فاصله 320 پیکسل
      const xPos = (index - 1) * 320;

      gsap.to(slide, {
        x: xPos,
        scale: isCenter ? 1.1 : 0.9,
        opacity: isCenter ? 1 : 0.6,
        zIndex: isCenter ? 10 : 1,
        duration: 0.6,
        ease: "power3.out",
      });
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

  return (
    <div className="w-full py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl mb-4 ${AriaBold.className} text-black`}
          >
            {title}
          </h2>
          <div className=" h-full">
            <p className={` ${maneli.className} text-gray-500 `}>
              جایی که در آن زیبایی ، کاربرد و پایداری در کنار هم قرار گرفته اند
            </p>
          </div>
        </div>

        <div className="relative h-[350px] flex justify-center items-center overflow-hidden">
          {getVisibleProducts().map((product, i) => (
            <div
              key={`${product.id}-${startIndex}`}
              ref={(el) => {
                slidesRef.current[i] = el;
              }}
              className="absolute top-0 w-[300px] h-[350px] rounded-xl shadow-lg cursor-pointer bg-white"
            >
              <Link
                href={`/shop/${product.id}`}
                className="block h-full relative overflow-hidden rounded-xl"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </Link>

              {i === 1 && (
                <div className="absolute bottom-6 left-0 right-0 px-4 text-center">
                  <h3 className={`text-lg ${AriaBold.className} text-black`}>
                    {product.name}
                  </h3>
                  <p className="text-black font-semibold">
                    {product.price} تومان
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    {product.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-20"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-20"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlideFendi;
