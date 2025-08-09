"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { maneli } from "@/next-persian-fonts/maneli";

interface BlogCard {
  id: number;
  title: string;
  image: string;
  buttonText: string;
}

interface BlogCardSliderProps {
  title?: string;
}

const BlogCardSlider: React.FC<BlogCardSliderProps> = () => {
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  const blogCards: BlogCard[] = [
    {
      id: 1,
      title: "بوتیک‌های خاص در منطقه طراحی میامی",
      image: "/assets/images/aboutsec2.png",
      buttonText: "بیشتر ",
    },
    {
      id: 2,
      title: "طراحی پایدار؛ همکاری برندهای استرالیایی",
      image: "/assets/images/aboutHero.png",
      buttonText: "بیشتر ",
    },
    {
      id: 3,
      title: "نگاهی به فروشگاه فندی در هوشی‌مین",
      image: "/assets/images/aboutsec2.png",
      buttonText: "بیشتر ",
    },
    {
      id: 4,
      title: "ترندهای خاص در هفته مد توکیو",
      image: "/assets/images/aboutHero.png",
      buttonText: "بیشتر ",
    },
    {
      id: 5,
      title: "کالکشن لاکچری برندهای فرانسوی",
      image: "/assets/images/aboutsec2.png",
      buttonText: "بیشتر ",
    },
    {
      id: 6,
      title: "افتتاح فروشگاه جدید در نیویورک",
      image: "/assets/images/aboutHero.png",
      buttonText: "بیشتر ",
    },
  ];
  const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
  
  const scrollDesktop = (direction: "left" | "right") => {
    if (direction === "right" && currentDesktopIndex < blogCards.length - 5) {
      setCurrentDesktopIndex(prev => prev + 1);
    } else if (direction === "left" && currentDesktopIndex > 0) {
      setCurrentDesktopIndex(prev => prev - 1);
    }
  };

  const nextMobileSlide = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % blogCards.length);
  };

  const prevMobileSlide = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + blogCards.length) % blogCards.length);
  };

  return (
    <div className="w-full py-16 bg-white" dir="rtl">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className={`text-3xl lg:text-4xl text-black ${AriaBold.className}`}>
          آخرین مقالات و اخبار
        </h2>
      </div>
      
      <div className="w-full relative ">
        <h3 className="text-2xl  mb-6 text-center">
          <span
            className={`text-3xl mb-4 md:text-4xl ${AriaBold.className} text-black`}
          >
            بلاگ
          </span>
        </h3>
        <div className=" h-full text-center mb-3">
          <p className={` ${maneli.className} text-gray-500 `}>
            نکته ها، داستان ها، تجربه های واقعی
          </p>
        </div>
        <div className="lg:px-24 mx-auto">
          {/* Mobile: Single Image Slider */}
          <div className="lg:hidden px-8">
            <div className="group cursor-pointer">
              <div className="relative w-full aspect-square overflow-hidden mb-4">
                <Image
                  src={blogCards[currentMobileIndex].image}
                  alt={blogCards[currentMobileIndex].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-black text-center">
                <h3 className={`text-base ${AriaBold.className} mb-4`}>
                  {blogCards[currentMobileIndex].title}
                </h3>
                <button className="inline-flex items-center cursor-pointer text-black transition-all duration-200 group-hover:-translate-x-1 relative">
                  <span className="text-sm font-medium">
                    {blogCards[currentMobileIndex].buttonText}
                  </span>
                  <svg
                    className="ml-2 w-4 h-4 rotate-180"
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

          {/* Desktop: 5 Images with Overflow */}
          <div className="hidden lg:block overflow-hidden">
            <div
              ref={desktopScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide"
              style={{ 
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
                width: "calc(100% + 100px)"
              }}
            >
              {blogCards.map((card) => (
                <div key={card.id} className="flex-shrink-0 group cursor-pointer" style={{ width: "calc(20% - 30px)" }}>
                  <div className="relative w-full aspect-square overflow-hidden mb-4">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-black">
                    <h3 className={`text-base ${AriaBold.className} mb-4`}>
                      {card.title}
                    </h3>
                    <button className="inline-flex items-center cursor-pointer text-black transition-all duration-200 group-hover:-translate-x-1 relative">
                      <span className="text-sm font-medium">
                        {card.buttonText}
                      </span>
                      <svg
                        className="ml-2 w-4 h-4 rotate-180"
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
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <button
          onClick={prevMobileSlide}
          className="absolute lg:hidden left-0 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-800 hover:bg-gray-50/40 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
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
          onClick={nextMobileSlide}
          className="absolute lg:hidden right-0 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-800 hover:bg-gray-50/40 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
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

        {/* Desktop Navigation */}
        <button
          onClick={() => scrollDesktop("left")}
          className="absolute hidden lg:flex left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-800 hover:bg-gray-50/40 transition-all duration-200 hover:scale-110 z-10 items-center justify-center"
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
          onClick={() => scrollDesktop("right")}
          className="absolute hidden lg:flex right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-800 hover:bg-gray-50/40 transition-all duration-200 hover:scale-110 z-10 items-center justify-center"
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
    </div>
  );
};

export default BlogCardSlider;
