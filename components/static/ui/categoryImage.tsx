"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MixedGridShowcaseProps } from "@/types/type";
import MixedGridCardDesktop from "./mixedGridCardDesktop";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { maneli } from "@/next-persian-fonts/maneli";

const MixedGridShowcase: React.FC<MixedGridShowcaseProps> = ({
  categories,
  // title = "دسته‌بندی‌های ما",
  // subtitle = "کشف کنید، تجربه کنید، لذت ببرید",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    once: true,
    margin: "-20%",
    amount: 0.1,
  });
  const staticTextPositionsLg = [
    {
      dotPosition: { top: -25, right: 6 },
      lineDirection: "horizontal-left",
      lineLength: 70,
      text: "گیفت کارت ",
      textAlign: "left",
      textOrientation: "horizontal",
    },
    {
      dotPosition: { bottom: -20, right: 8 },
      lineDirection: "horizontal-left",
      lineLength: 70,
      text: "خانه و سبک زندگی",
      textAlign: "left",
      textOrientation: "horizontal",
    },
    {
      dotPosition: { top: -25, right: 60 },
      lineDirection: "horizontal-left",
      lineLength: 60,
      text: "چرم ترکیبی",
      textAlign: "left",
      textOrientation: "horizontal",
    },
    {
      dotPosition: { top: -25, right: 8 },
      lineDirection: "horizontal-left",
      lineLength: 80,
      text: "اکسسوری",
      textAlign: "right",
      textOrientation: "horizontal",
    },
    {
      dotPosition: { top: 0, left: -25 },
      lineDirection: "vertical-down",
      lineLength: 80,
      text: "تابلوها",
      textAlign: "left",
      textOrientation: "vertical",
    },
    {
      dotPosition: { top: 0, right: -20 },
      lineDirection: "vertical-down",
      lineLength: 100,
      text: "کیف",
      textAlign: "left",
      textOrientation: "vertical",
    },
  ];

  // Static positions for each image - Updated for smaller sizes
  const staticPositionsLg = [
    { x: 100, y: 160, width: 243, height: 304, zIndex: 80 },
    // 1
    { x: 290, y: 255, width: 301, height: 363, zIndex: 115 },
    // 3
    { x: 530, y: 160, width: 300, height: 360, zIndex: 110 },
    // 4
    { x: 800, y: 100, width: 307, height: 230, zIndex: 105 },
    // 5
    { x: 30, y: 465, width: 307, height: 300, zIndex: 35 },
    // 2
    { x: 800, y: 390, width: 379, height: 417, zIndex: 100 },
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
      className="relative w-full min-h-full px-4 p-23 pb-50  flex flex-col items-center "
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      // style={{
      //   backgroundImage: "url('/assets/images/texture.png')",
      //   backgroundSize: "cover",
      // }}
    >
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-b from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      >
        {/* Decorative bottom dot */}
      </motion.div>

      {/* Bottom Vertical Line - Coming up 30px from bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-[4rem] md:h-[5rem] lg:h-[6rem] bg-gradient-to-t from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to top, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      >
        {/* Decorative top dot */}
      </motion.div>
      <h2 className={`text-xl md:text-4xl  mb-4 ${AriaBold.className} `}>
        دسته بندی محصولات
      </h2>
      <div className=" h-full">
        <p className={` ${maneli.className} text-gray-500 `}>
          کشف کنید ، تجربه کنید و لذت ببرید{" "}
        </p>
      </div>
      {/* Desktop: Static positioned grid */}
      <div className="flex justify-center items-center  w-full">
        <div className="relative w-full max-w-6xl h-[400px] md:h-[700px]">
          {" "}
          {categories.slice(0, 6).map((category, index) => {
            const pattern = gridPatterns[index % gridPatterns.length];
            const position = isMobile
              ? staticPositionsSm[index % staticPositionsSm.length]
              : isTablet
              ? staticPositionsMd[index % staticPositionsMd.length]
              : staticPositionsLg[index % staticPositionsLg.length];

            const textMeta = staticTextPositionsLg[index];

            return (
              <motion.div
                key={category.id}
                custom={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="absolute"
                style={{
                  left: position.x,
                  top: position.y,
                  width: position.width,
                  height: position.height,
                  zIndex: hoveredIndex === index ? 999 : position.zIndex,
                }}
              >
                <MixedGridCardDesktop
                  category={category}
                  index={index}
                  isHovered={hoveredIndex === index}
                  size={pattern.size}
                  position={{
                    width: position.width,
                    height: position.height,
                    x: 0,
                    y: 0,
                  }}
                  zIndex={hoveredIndex === index ? 999 : position.zIndex}
                />

                {/* TEXT POINTER WITH LINE */}
                {!isMobile && !isTablet && textMeta && (
                  <div
                    className="absolute"
                    style={{
                      top: textMeta.dotPosition?.top,
                      left: textMeta.dotPosition?.left,
                      right: textMeta.dotPosition?.right,
                      bottom: textMeta.dotPosition?.bottom,
                    }}
                  >
                    {/* Dot */}
                    <div className="absolute w-2 h-2 bg-black rounded-full z-10" />

                    {/* Line */}
                    {textMeta.lineDirection === "horizontal-left" && (
                      <div
                        className="absolute top-1 bg-black h-[0.5px]"
                        style={{ width: textMeta.lineLength, right: 0 }}
                      />
                    )}
                    {textMeta.lineDirection === "horizontal-right" && (
                      <div
                        className="absolute top-1 bg-black h-0.5"
                        style={{ width: textMeta.lineLength, left: 8 }}
                      />
                    )}
                    {textMeta.lineDirection === "vertical-down" && (
                      <div
                        className="absolute left-[3px] bg-black w-[1px]"
                        style={{ height: textMeta.lineLength, top: 8 }}
                      />
                    )}

                    {/* Text */}
                    <div
                      className={`absolute text-sm ${
                        AriaBold.className
                      }  whitespace-nowrap ${
                        textMeta.textOrientation === "vertical"
                          ? textMeta.textAlign === "right"
                            ? "transform rotate-90"
                            : "transform -rotate-90"
                          : ""
                      }`}
                      style={{
                        ...(textMeta.lineDirection === "horizontal-left" && {
                          right: textMeta.lineLength + 8,
                          top: -5,
                        }),
                        ...(textMeta.lineDirection === "horizontal-right" && {
                          left: textMeta.lineLength + 16,
                          top: -8,
                        }),
                        ...(textMeta.lineDirection === "vertical-down" &&
                          textMeta.textAlign === "left" && {
                            left: -10,
                            top: textMeta.lineLength + 20,
                            transformOrigin: "center center",
                          }),
                        ...(textMeta.lineDirection === "vertical-down" &&
                          textMeta.textAlign === "right" && {
                            left: -18,
                            top: textMeta.lineLength + 26,
                            transformOrigin: "center center",
                          }),
                      }}
                    >
                      {textMeta.text}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Marquee with better UX */}

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
