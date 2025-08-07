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
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/37.webp?versionId=",
    "https://tiranstyle.s3.ir-thr-at1.arvanstorage.ir/38.webp?versionId=",
  ];

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [centerImage] = useState("/assets/images/center.webp");
  const [isRapidChanging, setIsRapidChanging] = useState(false);
  const [showBlockHide, setShowBlockHide] = useState(false);
  const [showCenterScale, setShowCenterScale] = useState(false);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [gridImages] = useState(() => {
    const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 24); // 3 images per position (8 positions)
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Slide variants for video transition

  console.log(onComplete);

  useEffect(() => {
    const initialImages = [...gridImages.slice(0, 8), centerImage];
    initialImages[4] = centerImage;
    setCurrentImages(initialImages);
  }, [gridImages, centerImage]);

  // Enhanced animation sequence
  useEffect(() => {
    const startAnimationSequence = async () => {
      // Reset all states
      setShowVideoTransition(false);
      setShowCenterScale(false);
      setShowBlockHide(false);

      // Step 1: Start rapid image changing for 3 seconds
      setIsRapidChanging(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Stop rapid changing and start individual block hide animations
      setIsRapidChanging(false);
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
    };

    const interval = setInterval(() => {
      startAnimationSequence();
    }, 3000); // Total cycle: 10 seconds

    startAnimationSequence();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isRapidChanging) return;

    const rapidInterval = setInterval(() => {
      setCurrentImages((prevImages) => {
        const newImages = [...prevImages];
        for (let i = 0; i < 9; i++) {
          if (i === 4) {
            newImages[i] = centerImage;
          } else {
            const positionIndex = i > 4 ? i - 1 : i;
            const imageIndex = (positionIndex * 3) + Math.floor(Math.random() * 3);
            newImages[i] = gridImages[imageIndex] || gridImages[0];
          }
        }
        return newImages;
      });
    }, 200);

    return () => clearInterval(rapidInterval);
  }, [isRapidChanging, gridImages, centerImage]);

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
                    {currentImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className={`relative overflow-hidden transition-all duration-500 ${
                          index === 4
                            ? isTransitioning
                              ? "w-screen h-screen fixed inset-0 z-50 rounded-none"
                              : showCenterScale
                              ? "w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 scale-125 z-20 ring-2 ring-white/50"
                              : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 ring-1 ring-white/30"
                            : "w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
                        } ${
                          showBlockHide && index !== 4
                            ? "opacity-0 scale-75"
                            : "opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          width={500}
                          height={500}
                          alt={`Fashion ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
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
