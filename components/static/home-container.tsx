"use client";
import CategoryShowcase from "@/components/static/ui/categoryImage";
import DynamicFashionGrid from "@/components/static/ui/dynamicFashionGrid";
import { useState, useLayoutEffect, Suspense, lazy } from "react";
import Image from "next/image";
import { categories } from "@/lib/homePageData";
import NewProductRow from "../global/newProducts";
import VideoScrollScale from "./ui/videoScrollScale";
import ProductSlideFendi from "../global/productSlideFendi";


// Lazy load heavy components
const LazyVideoSection = lazy(() => import("./ui/VideoSection"));
const LazyBlogCardSlider = lazy(() => import("../global/BlogCardSlider"));

const Page = () => {
  const SHOW_LOGO = true; // Set to false to disable logo loading
  
  const [currentComponent, setCurrentComponent] = useState<
    "logo" | "grid" | "transition" | "showcase"
  >("showcase"); // Default to showcase
  const [showLogo, setShowLogo] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);


  // Preload critical assets
  const preloadAssets = async () => {
    const criticalImages = [
      "/assets/images/center.webp",
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

    const criticalVideos = [
      "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/aqYWNXrvpA/origin_X2X6eocORxrdmKJZmP72TmhiZVpi352VXTYuf79J.mp4",
      "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/NYVMk7Mvnl/origin_8WmQvnpZ3v8Oo2f0Qwkz6ZBuEVpki3dkGO7ScAKK.mp4",
      "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/JgkjrgQM1L/origin_cmnAgrjNDQIW1v9QWIRJylVyk5sZLLZ1EUVqhcL6.mp4",
    ];

    // Load images first (faster)
    const imagePromises = criticalImages.map(src => {
      return new Promise(resolve => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    });

    // Load video metadata (lighter than full video)
    const videoPromises = criticalVideos.map(src => {
      return new Promise(resolve => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.onloadedmetadata = resolve;
        video.onerror = resolve;
        video.src = src;
      });
    });

    // Load images first, then videos
    await Promise.all(imagePromises);
    await Promise.all(videoPromises);
    setAssetsLoaded(true);
  };

  console.log(assetsLoaded)


  // Check localStorage asynchronously to avoid blocking
  useLayoutEffect(() => {
    const checkGridStatus = async () => {
      try {
        const hasSeenGrid = localStorage.getItem("tiran-fashion-grid-seen");
        
        if (hasSeenGrid !== "true") {
          if (SHOW_LOGO) {
            setCurrentComponent("logo");
            setShowLogo(true);
            
            // First time: 3 seconds + asset loading
            const loadingPromise = preloadAssets();
            
            await Promise.all([
              new Promise(resolve => setTimeout(resolve, 7000)),
              loadingPromise
            ]);
            
            setShowLogo(false);
            setCurrentComponent("grid");
            setShowGrid(true);
          } else {
            await preloadAssets();
            setCurrentComponent("grid");
            setShowGrid(true);
          }
        } else {
          // Returning users: quick 300ms logo + fast loading (assets cached)
          if (SHOW_LOGO) {
            setCurrentComponent("logo");
            setShowLogo(true);
            
            const loadingPromise = preloadAssets();
            
            await Promise.all([
              new Promise(resolve => setTimeout(resolve, 300)),
              loadingPromise
            ]);
            
            setShowLogo(false);
            setCurrentComponent("grid");
            setShowGrid(true);
          } else {
            await preloadAssets();
            setCurrentComponent("grid");
            setShowGrid(true);
          }
        }
      } catch {
        // Fallback if localStorage fails
        setCurrentComponent("showcase");
        setShowShowcase(true);
      }
    };

    // Use requestIdleCallback for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(checkGridStatus);
    } else {
      setTimeout(checkGridStatus, 0);
    }
  }, [SHOW_LOGO]);

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
      {/* Logo Loading - shows for 100ms before grid */}
      {currentComponent === "logo" && (
        <div
          className={`fixed inset-0 z-[60] bg-white flex items-center justify-center transition-all duration-300 ease-in-out ${
            showLogo ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image 
            src="/assets/images/logo.png" 
            alt="TIRAN Logo" 
            width={128}
            height={128}
            className="w-32 h-32 object-contain"
          />
        </div>
      )}

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
              <Suspense fallback={<div className="min-h-screen bg-gray-100 animate-pulse" />}>
                <LazyVideoSection />
              </Suspense>
            </div>
            <NewProductRow
              title="مجموعه تابلوها"
              description="جدیدترین کیف ها را کشف کنید"
              endpoint="/api/shop"
              className=""
              category=""
            />
            <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
              <LazyBlogCardSlider />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
