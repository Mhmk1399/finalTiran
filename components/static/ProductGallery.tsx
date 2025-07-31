"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ProductGalleryProps } from "@/types/type";

export default function ProductGallery({
  primaryImage,
  secondaryImage,
  additionalImages,
  productName,
  layout,
  activeImageIndex = 0,
  onThumbnailClick,
}: // onImageChange,
ProductGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dotsFixed, setDotsFixed] = useState(true);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainImagesRef = useRef<HTMLDivElement>(null);

  console.log(canScrollDown, canScrollUp);

  // Combine all images
  const allImages = [primaryImage, secondaryImage, ...additionalImages].filter(
    Boolean
  );
  // Smooth scroll to active image in main gallery
  useEffect(() => {
    if (layout === "desktop" && mainImagesRef.current) {
      const targetImage = mainImagesRef.current.children[
        activeImageIndex
      ] as HTMLElement;
      if (targetImage) {
        targetImage.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [activeImageIndex, layout]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // 📌 IntersectionObserver برای تشخیص عکس فعال
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setCurrentImageIndex(idx);
          }
        });
      },

      {
        root: containerRef.current, // کانتینر اسکرول اصلی
        threshold: 0.5, // حداقل ۵۰٪ تصویر تو دید باشه
      }
    );

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      imageRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Effect: Scroll to active thumbnail when image changes or layout switches to thumbnails
  useEffect(() => {
    if (layout === "thumbnails") {
      checkScrollPosition();
      scrollToActiveThumbnail(activeImageIndex);
    }
  }, [activeImageIndex, layout]);

  // Effect: Set up scroll event listener for thumbnail navigation buttons
  useEffect(() => {
    if (layout === "thumbnails") {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition();

        // Cleanup: Remove scroll event listener on component unmount
        return () =>
          container.removeEventListener("scroll", checkScrollPosition);
      }
    }
  }, [layout]);

  // click on Thumbnails to scroll to main images
  const handleThumbnailClick = (index: number) => {
    if (onThumbnailClick) {
      onThumbnailClick(index);
    }
  };

  // Check scroll position for thumbnail navigation
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  // Auto-scroll to active thumbnail
  const scrollToActiveThumbnail = (index: number) => {
    if (scrollContainerRef.current) {
      const thumbnailHeight = 120;
      const containerHeight = scrollContainerRef.current.clientHeight;
      const targetScrollTop =
        index * thumbnailHeight - containerHeight / 2 + thumbnailHeight / 2;

      scrollContainerRef.current.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  };

  // Function: Open zoom modal with selected image for detailed view
  const handleZoom = (imageSrc: string) => {
    setZoomedImageSrc(imageSrc);
    setIsZoomed(true);
  };

  // 📌 اسکرول به تصویر انتخابی
  const handleDotClick = (index: number) => {
    imageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // 📌 بررسی وضعیت اسکرول برای تغییر حالت فیکس دات‌ها
  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const scrollBottom = el.scrollTop + el.clientHeight;
    const isAtBottom = scrollBottom >= el.scrollHeight - 5;
    setDotsFixed(!isAtBottom);
  };

  // Desktop Layout - Single Image with Navigation
  if (layout === "desktop") {
    const nextImage = () => {
      const nextIndex = (activeImageIndex + 1) % allImages.length;
      if (onThumbnailClick) onThumbnailClick(nextIndex);
    };

    const prevImage = () => {
      const prevIndex = (activeImageIndex - 1 + allImages.length) % allImages.length;
      if (onThumbnailClick) onThumbnailClick(prevIndex);
    };

    return (
      <div className="relative h-full w-full flex flex-col">
        {/* Main Image Display */}
        <div className="flex-1 relative bg-white overflow-hidden shadow-sm group">
          <Image
            src={allImages[activeImageIndex] || ""}
            alt={`${productName} - تصویر ${activeImageIndex + 1}`}
            width={500}
            height={700}
            className="w-full h-full object-contain"
            priority
          />

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            aria-label="zoom"
            onClick={() => allImages[activeImageIndex] && handleZoom(allImages[activeImageIndex])}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ZoomIn size={18} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {activeImageIndex + 1} / {allImages.length}
          </div>
        </div>


        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 flex items-center justify-center p-4"
              onClick={() => setIsZoomed(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={zoomedImageSrc}
                  alt={`${productName} - تصویر بزرگ`}
                  width={1200}
                  height={1600}
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => setIsZoomed(false)}
                  className="absolute top-4 right-4 p-2 bg-white/80 text-black rounded-full hover:bg-white/30 transition-colors cursor-pointer"
                  aria-label="Close zoom"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Thumbnails Layout - Right Sidebar
  if (layout === "thumbnails") {
    return (
      <div className="h-full w-fit flex flex-col">
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin"
        >
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`relative cursor-pointer transition-all duration-300 overflow-hidden ${
                activeImageIndex === index
                  ? "ring-2 ring-gray-400 opacity-100 shadow-md"
                  : "opacity-50 hover:opacity-80"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="">
                <Image
                  src={image || ""}
                  width={500}
                  height={500}
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-20 h-20 transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll to Top Button */}
        <div className="flex justify-center p-3">
          <button
            onClick={() => {
              // Select first thumbnail
              handleThumbnailClick(0);
              // Scroll to top
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 shadow-sm"
            aria-label="Go to first image and scroll to top"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Mobile Layout - scrollbar Slider
  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {allImages.map((image, index) => (
        <motion.div
          data-index={index}
          ref={(el) => {
            imageRefs.current[index] = el;
          }}
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative group bg-white overflow-hidden"
        >
          <Image
            src={image || ""}
            alt={`${productName} - تصویر ${index + 1}`}
            width={800}
            height={1200}
            className="w-full h-auto object-contain"
            onClick={() => image && handleZoom(image)}
          />
        </motion.div>
      ))}

      {/* دات‌ها */}
      <div
        className={`${
          dotsFixed ? "fixed top-1/2 -right-2" : "absolute right-2 bottom-4"
        } flex flex-row-reverse rotate-90 gap-2 transition-all duration-300 z-50`}
      >
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-5 h-1 rounded-sm transition-all ${
              currentImageIndex === index ? "bg-black" : "bg-gray-300"
            }`}
            aria-label={`رفتن به تصویر ${index + 1}`}
          />
        ))}
      </div>

      {/* زوم مودال */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={zoomedImageSrc}
                alt={`${productName} - تصویر بزرگ`}
                width={1200}
                height={1600}
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 lg:bg-white/80 text-black rounded-full hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
