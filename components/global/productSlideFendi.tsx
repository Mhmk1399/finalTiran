"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";

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

  // دریافت 5 محصول برای نمایش (2 چپ، 1 مرکز، 2 راست)
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

    // انیمیشن خروج
    productRefs.current.forEach((card, i) => {
      if (card) {
        const targetX = (i - 2) * 500; // موقعیت نهایی
        const moveOutX = direction === "next" ? -500 : 500;

        gsap.to(card, {
          x: targetX + moveOutX,
          opacity: i === 2 ? 0 : 0.5,
          scale: i === 2 ? 0.8 : 0.7,
          duration: 0.6,
          ease: "power3.inOut",
        });
      }
    });

    // تغییر ایندکس
    setTimeout(() => {
      setCurrentIndex(newIndex);

      // تنظیم موقعیت اولیه برای انیمیشن ورود
      productRefs.current.forEach((card, i) => {
        if (card) {
          const targetX = (i - 2) * 500;
          const moveInX = direction === "next" ? 500 : -500;

          gsap.set(card, {
            x: targetX + moveInX,
            opacity: 0,
            scale: i === 2 ? 0.8 : 0.7,
          });
        }
      });

      // انیمیشن ورود
      productRefs.current.forEach((card, i) => {
        if (card) {
          const targetX = (i - 2) * 500;
          const isCenter = i === 2;

          gsap.to(card, {
            x: targetX,
            opacity: isCenter ? 1 : 0.7,
            scale: isCenter ? 1.3 : 0.85,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              if (i === productRefs.current.length - 1) {
                setIsAnimating(false);
              }
            },
          });
        }
      });
    }, 100);
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
            opacity: 0,
            scale: 0.8,
          },
          {
            x: targetX,
            opacity: isCenter ? 1 : 0.7,
            scale: isCenter ? 1.3 : 0.85,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.1,
          }
        );
      }
    });
  }, []);

  const visibleProducts = getVisibleProducts();
  const centerProduct = visibleProducts[2];

  return (
    <div
      className="w-full py-24 md:py-28 lg:py-32 relative overflow-hidden"
      dir="rtl"
      style={{
        background: `url('/assets/images/texture.png')`,
      }}
    >
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
            className={`text-3xl md:text-4xl ${AriaBold.className} text-black`}
          >
            {title}
          </h2>
        </div>

        {/* اسلایدر محصولات */}
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
                key={`${product.id}-${index}`}
                className="product-card absolute will-change-transform"
                style={{
                  transform: `translateX(${translateX}px) scale(${
                    isCenter ? 1.3 : 0.85
                  })`,
                  zIndex: isCenter ? 10 : 5 - Math.abs(position),
                  opacity: isCenter ? 1 : 0.7,
                }}
              >
                <Link href={`/shop/${product.id}`}>
                  <div className="w-[320px] h-[350px] bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl relative">
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
            {centerProduct.colors.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-gray-300 transition-all duration-200 hover:scale-125 hover:border-gray-600 cursor-pointer shadow-sm will-change-transform"
                style={{ backgroundColor: color }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.3,
                    duration: 0.2,
                    ease: "power2.out",
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out",
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* دکمه‌های ناوبری */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-12 bottom-20 md:top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full  hover:bg-white  transition-all duration-300 hover:scale-110 focus:outline-none"
        aria-label="محصول قبلی"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        className="absolute right-12 bottom-20 md:top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full  hover:bg-white  transition-all duration-300 hover:scale-110 focus:outline-none"
        aria-label="محصول بعدی"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
  );
};

export default ProductSlideFendi;
