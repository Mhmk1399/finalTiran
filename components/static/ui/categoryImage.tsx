"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MixedGridShowcaseProps } from "@/types/type";
import MixedGridCardDesktop from "./mixedGridCardDesktop";
import Link from "next/link";
import { AriaBold } from "@/next-persian-fonts/woff2";

const MixedGridShowcase: React.FC<MixedGridShowcaseProps> = ({
  categories,
  // title = "دسته‌بندی‌های ما",
  // subtitle = "کشف کنید، تجربه کنید، لذت ببرید",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 430) {
      setIsMobile(true);
    } else if (window.innerWidth <= 1054) {
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  }, []);

  const isInView = useInView(containerRef, {
    once: false,
    margin: "-20%",
    amount: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isInView]);

  // Static positions for each image - Updated for smaller sizes
  const staticPositionsLg = [
    { x: 130, y: 160, width: 243, height: 304, zIndex: 80 },
    // 1
    { x: 320, y: 255, width: 301, height: 363, zIndex: 90 },
    // 3
    { x: 540, y: 155, width: 300, height: 360, zIndex: 100 },
    // 4
    { x: 720, y: 80, width: 307, height: 225, zIndex: 105 },
    // 5
    { x: 80, y: 420, width: 310, height: 372, zIndex: 35 },
    // 2
    { x: 720, y: 340, width: 379, height: 417, zIndex: 100 },
    // 6
  ];
  const staticPositionsMd = [
    { x: 50, y: 130, width: 218, height: 272, zIndex: 80 },
    // 1
    { x: 30, y: 500, width: 277, height: 332, zIndex: 35 },
    // 2
    { x: 150, y: 300, width: 255, height: 308, zIndex: 90 },
    // 3
    { x: 402, y: 180, width: 300, height: 360, zIndex: 100 },
    // 4
    { x: 600, y: 130, width: 225, height: 164, zIndex: 105 },
    // 5
    { x: 450, y: 440, width: 297, height: 331, zIndex: 100 },
    // 6
  ];

  const staticPositionsSm = [
    { x: 20, y: -70, width: 129, height: 169, zIndex: 80 },
    // 1
    { x: 30, y: 120, width: 151, height: 183, zIndex: 95 },
    // 3
    { x: 5, y: 260, width: 164, height: 197, zIndex: 90 },
    // 2
    { x: 130, y: 30, width: 157, height: 188, zIndex: 100 },
    // 4
    { x: 190, y: -50, width: 133, height: 97, zIndex: 105 },
    // 5

    { x: 150, y: 200, width: 176, height: 196, zIndex: 100 },
    // 6
  ];

  const gridPatterns = [
    {
      size: "large",
      priority: "high",
    },
    {
      size: "medium",
      priority: "medium",
    },
    {
      size: "small",
      priority: "low",
    },
    {
      size: "wide",
      priority: "high",
    },
    {
      size: "small",
      priority: "low",
    },
    {
      size: "featured",
      priority: "featured",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full min-h-full px-4 pt-23 pb-30 md:-mt-43 flex flex-col items-center "
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        backgroundImage: "url('/assets/images/texture.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Desktop: Static positioned grid */}
      <div className="flex justify-center items-center  w-full">
        <div className="relative w-full max-w-6xl h-[400px] md:h-[700px]">
          {" "}
          {/* Central Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-190 pointer-events-none">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2
                className={`text-4xl md:text-5xl lg:text-6xl  ${AriaBold.className} text-white mb-2 tracking-wide`}
              >
                <Link href="/shop">تیران</Link>
              </h2>
            </motion.div>
          </div>
          {categories.slice(0, 6).map((category, index) => {
            const pattern = gridPatterns[index % gridPatterns.length];
            let position;

            if (isMobile) {
              position = staticPositionsSm[index % staticPositionsSm.length];
            } else if (isTablet) {
              position = staticPositionsMd[index % staticPositionsMd.length];
            } else {
              position = staticPositionsLg[index % staticPositionsLg.length];
            }

            return (
              <motion.div
                key={`${category.id}-${animationKey}`}
                custom={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <MixedGridCardDesktop
                  category={category}
                  index={index}
                  isHovered={hoveredIndex === index}
                  size={pattern.size}
                  position={position}
                  zIndex={position.zIndex}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Marquee with better UX */}
      <div className="md:hidden w-full overflow-hidden">
        {/* Mobile Text Overlay */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2
              className={`text-4xl md:text-5xl   ${AriaBold.className} text-white mb-2 tracking-wide`}
            >
              <Link href="/shop">تیران</Link>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* CSS Animations for Marquee */}
      <style jsx global>{`
        @keyframes marqueeLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marqueeLeft 20s linear infinite;
        }

        .animate-marquee-right {
          animation: marqueeRight 25s linear infinite;
        }

        /* Pause animation on hover/touch */
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </motion.div>
  );
};

export default MixedGridShowcase;
