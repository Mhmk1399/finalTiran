"use client";
import { useRef } from "react";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const blogCards: BlogCard[] = [
    {
      id: 1,
      title: "Miami Design District Boutique",
      image: "/assets/images/aboutsec2.png",
      buttonText: "Discover",
    },
    {
      id: 2,
      title: "Hand in Hand Australia",
      image: "/assets/images/aboutHero.png",
      buttonText: "Discover",
    },
    {
      id: 3,
      title: "Fendi Ho Chi Minh City",
      image: "/assets/images/aboutsec2.png",
      buttonText: "Discover",
    },
    {
      id: 4,
      title: "Tokyo Fashion Week",
      image: "/assets/images/aboutHero.png",
      buttonText: "Discover",
    },
    {
      id: 5,
      title: "Paris Luxury Collection",
      image: "/assets/images/aboutsec2.png",
      buttonText: "Discover",
    },
    {
      id: 6,
      title: "New York Store Opening",
      image: "/assets/images/aboutHero.png",
      buttonText: "Discover",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-16 bg-white">
      <div className="w-full ">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full text-gray-800 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
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
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full text-gray-800 hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10 flex items-center justify-center"
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

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-18 overflow-x-auto  scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {blogCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-[190px] group cursor-pointer mx-5"
              >
                <div className="relative w-[250px] h-[250px] overflow-hidden mb-4">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="text-black">
                  <h3 className={`text-lg ${AriaBold.className} mb-4`}>
                    {card.title}
                  </h3>

                  <button className="inline-flex items-center text-black border-b border-black pb-1 hover:border-opacity-70 transition-all duration-200 group-hover:translate-x-1">
                    <span className="text-sm font-medium">
                      {card.buttonText}
                    </span>
                    <svg
                      className="ml-2 w-4 h-4"
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
    </div>
  );
};

export default BlogCardSlider;
