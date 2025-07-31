"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentIndex, setCurrentIndex] = useState(1);

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

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % fakeProducts.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + fakeProducts.length) % fakeProducts.length
    );

  const getVisibleProducts = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index =
        (currentIndex + i + fakeProducts.length) % fakeProducts.length;
      result.push({ ...fakeProducts[index], position: i });
    }
    return result;
  };

  const centerProduct = fakeProducts[currentIndex];

  return (
    <div className="w-full py-16 bg-gray-50" dir="ltr">
      <div className="max-w-8xl mx-auto px-4 ">
        <div className="text-center mb-4">
          <h2
            className={`text-3xl md:text-4xl ${AriaBold.className} text-black`}
          >
            {title}
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative h-[400px] flex justify-center items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center gap-8"
            >
              {getVisibleProducts().map((product) => {
                const isCenter = product.position === 0;
                const translateX = product.position * 10;

                return (
                  <motion.div
                    key={product.id}
                    className="relative flex-shrink-0"
                    animate={{
                      x: translateX,
                      scale: isCenter ? 1.1 : 0.85,
                      opacity: isCenter ? 1 : 0.6,
                      zIndex: isCenter ? 10 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <Link href={`/shop/${product.id}`} className="block">
                      <div className="w-[300px] h-[350px] bg-white  shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full h-full">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
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
            className="absolute left-20 top-1/2 -translate-y-1/2 w-12 h-12  text-gray-800  transition-all duration-200 hover:scale-110 z-20 flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-20 top-1/2 -translate-y-1/2 w-12 h-12  text-gray-800  transition-all duration-200 hover:scale-110 z-20 flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <motion.div key={currentIndex} className="text-center mt-8 space-y-4">
          <h3 className={`text-2xl ${AriaBold.className} text-black`}>
            {centerProduct.name}
          </h3>
          <div className="flex justify-center gap-3 mt-4">
            {centerProduct.colors.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-gray-400 transition-transform hover:scale-125 cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductSlideFendi;
