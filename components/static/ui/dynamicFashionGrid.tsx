"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DynamicFashionGridProps {
  onComplete?: (centerImage: string) => void;
  // onTransitionStart?: () => void;
}

const DynamicFashionGrid = ({ onComplete }: DynamicFashionGridProps) => {
  // Sample fashion images
  const fashionImages = [
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/1.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/2.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/3.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/4.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/5.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/6.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/7.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/8.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/9.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/10.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/11.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/12.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/13.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/14.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/15.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/16.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/17.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/18.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/19.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/20.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/21.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/22.webp?versionId=",
    // "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/23.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/24.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/25.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/26.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/27.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/28.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/29.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/30.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/31.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/32.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/33.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/34.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/35.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/36.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/37.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/38.webp?versionId=",
  
  ];

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [centerImage] = useState("/assets/images/center.webpg"); // Static center image
  // Animation states
  const [isRapidChanging, setIsRapidChanging] = useState(false);
  const [showBlockHide, setShowBlockHide] = useState(false);
  const [showCenterScale, setShowCenterScale] = useState(false);
  const [showCenterOpacity, setShowCenterOpacity] = useState(false);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [blockImages, setBlockImages] = useState<string[][]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Slide variants for video transition

  console.log(onComplete);

  // Generate random images for each block
  const generateBlockImages = () => {
    const blocks: string[][] = [];
    for (let i = 0; i < 9; i++) {
      const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
      blocks.push(shuffled.slice(0, 8));
    }
    return blocks;
  };

  // Initialize random images with static center
  useEffect(() => {
    const getRandomImages = () => {
      const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
      const images = shuffled.slice(0, 9);
      images[4] = "/assets/images/center.webp"; // Keep center image static
      return images;
    };
    const initialImages = getRandomImages();
    setCurrentImages(initialImages);
    setBlockImages(generateBlockImages());
  }, []);

  // Enhanced animation sequence
  useEffect(() => {
    const startAnimationSequence = async () => {
      // Reset all states
      setShowVideoTransition(false);
      setShowCenterOpacity(false);
      setShowCenterScale(false);
      setShowBlockHide(false);

      // Step 1: Start rapid image changing for 3 seconds
      setIsRapidChanging(true);
      setBlockImages(generateBlockImages());

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Step 2: Stop rapid changing and start individual block hide animations
      setIsRapidChanging(false);
      setShowBlockHide(true);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Step 3: Scale up center image
      setShowCenterScale(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Center image opacity animation
      setShowCenterOpacity(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // // Hold center image and prepare for video transition
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // setFinalCenterImage(centerImage);

      // // Notify parent about transition start
      // if (onTransitionStart) {
      //   onTransitionStart();
      // }

      // Start transition to video component
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Call completion callback
      if (onComplete) {
        onComplete(centerImage);
      }

      // Step 5: Transition to video showcase
      setShowVideoTransition(true);

      // Update text

      await new Promise((resolve) => setTimeout(resolve, 3000));
    };

    const interval = setInterval(() => {
      startAnimationSequence();
    }, 10000); // Total cycle: 10 seconds

    startAnimationSequence();

    return () => clearInterval(interval);
  }, []);

  // Rapid image changing effect
  useEffect(() => {
    if (!isRapidChanging) return;

    const rapidInterval = setInterval(() => {
      setCurrentImages((prevImages) => {
        const newImages = [...prevImages];
        for (let i = 0; i < 9; i++) {
          if (i === 4) {
            newImages[i] = "/assets/images/center.webp"; // Keep center static
          } else if (blockImages[i] && blockImages[i].length > 0) {
            const randomIndex = Math.floor(
              Math.random() * blockImages[i].length
            );
            newImages[i] = blockImages[i][randomIndex];
          }
        }
        return newImages;
      });
    }, 200);

    return () => clearInterval(rapidInterval);
  }, [isRapidChanging, blockImages]);

  // Individual block hide animations
  const getBlockHideStyle = (index: number) => {
    if (!showBlockHide || index === 4) return {};

    const hideAnimations = [
      { transform: "translateY(-100px) rotate(-15deg)", opacity: 0 }, // top-left
      { transform: "translateY(-120px)", opacity: 0 }, // top-center
      { transform: "translateY(-100px) rotate(15deg)", opacity: 0 }, // top-right
      { transform: "translateX(-100px) rotate(-10deg)", opacity: 0 }, // middle-left
      {}, // center - no animation
      { transform: "translateX(100px) rotate(10deg)", opacity: 0 }, // middle-right
      { transform: "translateY(100px) rotate(15deg)", opacity: 0 }, // bottom-left
      { transform: "translateY(120px)", opacity: 0 }, // bottom-center
      { transform: "translateY(100px) rotate(-15deg)", opacity: 0 }, // bottom-right
    ];

    return hideAnimations[index];
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: isTransitioning ? 0 : 1,
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative inset-0 h-full z-100000000"
      dir="rtl"
      // style={{
      //   background: `url('/assets/images/texture.png')`,
      // }}
    >
      {/* Top Vertical Line - Coming down 30px from top */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-25 bg-gradient-to-b from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
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
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-30 md:h-25 bg-gradient-to-t from-transparent to-gray-400 z-10 border-l border-dashed border-gray-400"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to top, transparent 0px, transparent 3px, #9ca3af 3px, #9ca3af 6px)",
          background: "none",
        }}
      >
        {/* Decorative top dot */}
      </motion.div>

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-none flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            {/* Center Content */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <div className="relative">
                {!showVideoTransition ? (
                  // Image Grid Phase - Smaller on mobile
                  <div className="grid grid-cols-3 gap-2 lg:gap-3 p-3 lg:p-6 backdrop-blur-lg rounded-2xl lg:rounded-3xl">
                    {currentImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className={`relative overflow-hidden transform transition-all duration-700 ease-out ${
                          index === 4
                            ? isTransitioning
                              ? "w-screen h-screen fixed inset-0 z-50 scale-100 rounded-none opacity-100"
                              : showCenterScale
                              ? showCenterOpacity
                                ? "w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 scale-150 lg:scale-200 z-20 ring-2 lg:ring-4 ring-white/50 rounded-lg opacity-100"
                                : "w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 scale-110 lg:scale-125 z-10 ring-2 lg:ring-4 ring-white/50 rounded-lg opacity-100"
                              : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 ring-1 lg:ring-2 ring-white/30 opacity-100"
                            : isRapidChanging
                            ? "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 scale-95 opacity-80"
                            : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 scale-100 opacity-100 hover:scale-105"
                        }`}
                        style={{
                          ...getBlockHideStyle(index),
                          transitionDuration: showBlockHide ? "700ms" : "200ms",
                          transitionTimingFunction: showBlockHide
                            ? "ease-in-out"
                            : "ease-out",
                        }}
                      >
                        <img
                          src={image}
                          alt={`Fashion ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-1000 ${
                            index === 4 && isTransitioning
                              ? "scale-110 brightness-110"
                              : ""
                          }`}
                        />

                        {/* Overlay for center image during transition */}
                        {index === 4 && isTransitioning && (
                          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 animate-pulse" />
                        )}

                        {isRapidChanging && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Video Showcase Phase - Responsive sizing
                  <div className="relative z-20"></div>
                )}

                {/* Center image highlight effect during scaling - Responsive sizing */}
                {showCenterScale && !showVideoTransition && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-white/5 rounded-full animate-ping" />
                  </div>
                )}

                {/* Transition overlay effect - Responsive sizing */}
                {showCenterOpacity && !showVideoTransition && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional transition effects */}
      {showVideoTransition && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
};

export default DynamicFashionGrid;
