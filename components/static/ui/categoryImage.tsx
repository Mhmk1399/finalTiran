"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MixedGridShowcaseProps } from "@/types/type";
import MixedGridCardDesktop from "./mixedGridCardDesktop";
import MixedGridCardMobile from "./mixedGridCardMobile";

// Mixed Grid Card Component (Updated for smaller size)

const MixedGridShowcase: React.FC<MixedGridShowcaseProps> = ({
  categories,
  // title = "دسته‌بندی‌های ما",
  // subtitle = "کشف کنید، تجربه کنید، لذت ببرید",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

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
  const staticPositions = [
    { x: 80, y: 80, width: 280, height: 260, zIndex: 80 },
    { x: 320, y: 180, width: 240, height: 320, zIndex: 70 },
    { x: 540, y: 200, width: 260, height: 360, zIndex: 80 },
    { x: 720, y: 90, width: 320, height: 280, zIndex: 45 },
    { x: 80, y: 360, width: 220, height: 240, zIndex: 35 },
    { x: 720, y: 380, width: 300, height: 240, zIndex: 60 },
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

  // Mobile marquee variants
  const marqueeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full min-h-screen pb-8 px-4 pt-10 md:-mt-8 flex flex-col items-center bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Desktop: Static positioned grid */}
      <div className="hidden md:flex justify-center items-center w-full">
        <div className="relative w-full max-w-6xl h-[600px] md:h-[700px]">
          {" "}
          {/* Reduced height */}
          {/* Central Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-90 pointer-events-none">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-wide">
                سبک زندگی
              </h2>
            </motion.div>
          </div>
          {categories.slice(0, 6).map((category, index) => {
            const pattern = gridPatterns[index % gridPatterns.length];
            const position = staticPositions[index % staticPositions.length];

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
            <h2 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
              سبک زندگی
            </h2>
          </motion.div>
        </div>

        {/* First Row - Left to Right */}
        <motion.div
          className="flex gap-4 mb-6"
          variants={marqueeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex gap-4 animate-marquee-left"
            style={{
              animation: "marqueeLeft 20s linear infinite",
            }}
          >
            {[...categories, ...categories]
              .slice(0, 8)
              .map((category, index) => (
                <motion.div
                  key={`mobile-left-${category.id}-${index}`}
                  custom={index}
                  variants={mobileItemVariants}
                  className="flex-shrink-0 w-56 h-72 overflow-hidden" // Reduced from w-64 h-80
                  onTouchStart={() => setHoveredIndex(index)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  whileTap={{ scale: 0.95 }}
                >
                  <MixedGridCardMobile
                    category={category}
                    index={index}
                    isHovered={hoveredIndex === index}
                    size="medium"
                  />
                </motion.div>
              ))}
          </motion.div>
        </motion.div>

        {/* Second Row - Right to Left */}
        <motion.div
          className="flex gap-4"
          variants={marqueeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex gap-4 animate-marquee-right"
            style={{
              animation: "marqueeRight 25s linear infinite",
            }}
          >
            {[...categories.slice().reverse(), ...categories.slice().reverse()]
              .slice(0, 8)
              .map((category, index) => (
                <motion.div
                  key={`mobile-right-${category.id}-${index}`}
                  custom={index + 4}
                  variants={mobileItemVariants}
                  className="flex-shrink-0 w-48 h-64 overflow-hidden" // Reduced from w-56 h-72
                  onTouchStart={() => setHoveredIndex(index + 10)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  whileTap={{ scale: 0.95 }}
                >
                  <MixedGridCardMobile
                    category={category}
                    index={index + 10}
                    isHovered={hoveredIndex === index + 10}
                    size="small"
                  />
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
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
