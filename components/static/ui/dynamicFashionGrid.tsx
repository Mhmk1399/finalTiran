"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface DynamicFashionGridProps {
  onComplete?: (centerImage: string) => void;
  // onTransitionStart?: () => void;
}

const DynamicFashionGrid = ({ onComplete }: DynamicFashionGridProps) => {
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
  ];

  // Divide images into groups of 4 for each position
  const positionImages = [
    fashionImages.slice(0, 4), // Position 0
    fashionImages.slice(4, 8), // Position 1
    fashionImages.slice(8, 12), // Position 2
    fashionImages.slice(12, 16), // Position 3
    [
      fashionImages[16],
      fashionImages[17],
      fashionImages[18],
      "/assets/images/center.webp",
    ], // Position 4 (center) - 4 images with center.webp as last
    fashionImages.slice(20, 24), // Position 5
    fashionImages.slice(24, 28), // Position 6
    fashionImages.slice(28, 32), // Position 7
    fashionImages.slice(32, 36), // Position 8
  ];

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [centerImage] = useState("/assets/images/center.webp");
  const [isRapidChanging, setIsRapidChanging] = useState(false);
  const [showBlockHide, setShowBlockHide] = useState(false);
  const [showCenterScale, setShowCenterScale] = useState(false);
  const [showVideoTransition, setShowVideoTransition] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  // Slide variants for video transition

  useEffect(() => {
    const initialImages = positionImages.map((images) => images[0]);
    setCurrentImages(initialImages);
  }, []);

  // Enhanced animation sequence
  useEffect(() => {
    const startAnimationSequence = async () => {
      // Reset all states
      setShowVideoTransition(false);
      setShowCenterScale(false);
      setShowBlockHide(false);

      // Step 1: Start rapid image changing for 3 seconds
      setIsRapidChanging(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 2: Stop rapid changing and show center.webp
      setIsRapidChanging(false);
      setCurrentImages((prev) => {
        const newImages = [...prev];
        newImages[4] = centerImage; // Set final center image (center.webp)
        return newImages;
      });

      // Wait a moment to show center.webp
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Step 3: Start individual block hide animations
      setShowBlockHide(true);

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Step 3: Scale up center image
      setShowCenterScale(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 4: Center image opacity animation
      await new Promise((resolve) => setTimeout(resolve, 100));

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

      await new Promise((resolve) => setTimeout(resolve, 5000));
    };

    const interval = setInterval(() => {
      startAnimationSequence();
    }, 5000); // Total cycle: 10 seconds

    startAnimationSequence();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isRapidChanging) return;

    const rapidInterval = setInterval(() => {
      setCurrentImages((prevImages) => {
        const newImages = [...prevImages];
        for (let i = 0; i < 9; i++) {
          // All positions: cycle through all 4 images randomly
          const randomIndex = Math.floor(Math.random() * 4);
          newImages[i] = positionImages[i][randomIndex];
        }
        return newImages;
      });
    }, 200);

    return () => clearInterval(rapidInterval);
  }, [isRapidChanging, centerImage]);

  return (
    <div
      className={`fixed inset-0 w-full h-full min-h-screen bg-white z-[9999] transition-opacity duration-1000 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      dir="rtl"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-25 border-l border-dashed border-gray-400 z-10" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-30 md:h-25 border-l border-dashed border-gray-400 z-10" />

      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-none flex items-center justify-center">
          <div className="flex items-center justify-center w-full h-full">
            {/* Center Content */}
            <div className="flex-shrink-0 flex justify-center items-center">
              <div className="relative">
                {!showVideoTransition ? (
                  // Image Grid Phase - Smaller on mobile
                  <div className="grid grid-cols-3 gap-2 lg:gap-3 p-3 lg:p-6 backdrop-blur-lg rounded-2xl lg:rounded-3xl">
                    {currentImages.length > 0 &&
                      currentImages.map(
                        (image, index) =>
                          image && (
                            <div
                              key={`${image}-${index}`}
                              className={`relative overflow-hidden ${
                                index === 4
                                  ? isTransitioning
                                    ? "w-screen h-screen fixed inset-0 z-50 rounded-none transition-all duration-700"
                                    : showCenterScale
                                    ? "w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 scale-125 z-20 transition-all duration-500"
                                    : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 transition-all duration-500"
                                  : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                              }`}
                            >
                              {/* Curtain overlay */}
                              {index !== 4 && (
                                <div
                                  className={`absolute inset-0 bg-white transition-all duration-200 ease-out ${
                                    showBlockHide
                                      ? "transform translate-y-0"
                                      : "transform -translate-y-full"
                                  }`}
                                  // style={{
                                  //   transitionDelay: showBlockHide ? `${index * 50}ms` : "0ms",
                                  // }}
                                />
                              )}
                              <Image
                                src={image}
                                width={500}
                                height={500}
                                alt={`Fashion ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                      )}
                  </div>
                ) : (
                  // Video Showcase Phase - Responsive sizing
                  <div className="relative z-20"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFashionGrid;
