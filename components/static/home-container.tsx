"use client";
import CategoryShowcase from "@/components/static/ui/categoryImage";
import DynamicFashionGrid from "@/components/static/ui/dynamicFashionGrid";
import { useState, useEffect } from "react";
import { categories } from "@/lib/homePageData";
import NewProductRow from "../global/newProducts";
import VideoScrollScale from "./ui/videoScrollScale";
import ProductSlideFendi from "../global/productSlideFendi";
import VideoSection from "./ui/VideoSection";
import BlogCardSlider from "../global/BlogCardSlider";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "grid" | "transition" | "showcase"
  >("showcase"); // Default to showcase
  const [showGrid, setShowGrid] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);

  // Check localStorage immediately on component mount
  useEffect(() => {
    const hasSeenGrid = localStorage.getItem("tiran-fashion-grid-sen");

    if (hasSeenGrid !== "true") {
      // First time user, show the grid
      setCurrentComponent("grid");
      setShowGrid(true);

      // Let the grid component handle its own timing
      // The transition will be triggered by the grid's onComplete callback
    } else {
      // Returning user, show showcase directly with no delay
      setCurrentComponent("showcase");
      setShowShowcase(true);
    }
  }, []);

  // Handle completion of grid animation
  const handleGridComplete = async () => {
    // Mark as seen
    localStorage.setItem("tiran-fashion-grid-seen", "true");

    // Immediate transition - no delay
    setShowGrid(false);
    setCurrentComponent("showcase");
    setShowShowcase(true);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* DynamicFashionGrid - shows for exactly 5 seconds on first visit */}
      {currentComponent === "grid" && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
            showGrid ? "opacity-100" : "opacity-0"
          }`}
        >
          <DynamicFashionGrid
            onComplete={handleGridComplete}
            // onTransitionStart={handleGridTransitionStart}
          />
        </div>
      )}

      {/* Main content - ONLY ScrollMediaShowcase renders here */}
      {currentComponent === "showcase" && (
        <div
          className={`relative z-30 transition-all duration-500 ease-in-out ${
            showShowcase
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-2"
          }`}
        >
          <div className="min-h-screen mt-20">
            <VideoScrollScale
            // transitionImage={videoTransitionImage}
            // isTransitioning={isFirstLoad}
            />
          </div>
          <div className="min-h-screen">
            <CategoryShowcase
              categories={categories}
              title="دسته‌بندی‌های ما"
              subtitle="کشف کنید، تجربه کنید، لذت ببرید"
            />
          </div>

          <div className="">
            {" "}
            <ProductSlideFendi
              title="محصولات جدید"
              // className="my-8"
              // endpoint="/api/shop"
              // category=""
            />
            <div className="min-h-screen">
              <VideoSection />
            </div>
            <NewProductRow
              title="مجموعه تابلوها"
              description="جدیدترین کیف ها را کشف کنید"
              endpoint="/api/shop"
              className=""
              category=""
            />
            <BlogCardSlider />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
