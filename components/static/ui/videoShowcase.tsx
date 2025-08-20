"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { videoData, getAllVideos } from "@/lib/homePageData";
import { VideoItem, CategoryData, Category } from "@/types/type";
import Image from "next/image";

export default function VideoShowcase() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [currentVideos, setCurrentVideos] = useState<VideoItem[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  const getAnimationDuration = () => {
    const videoCount = currentVideos.length;
    if (videoCount <= 9) return "35s";
    return "50s";
  };

  // Helper to safely load and play video
  const playVideoSafely = (video: HTMLVideoElement, src: string) => {
    video.pause();
    video.src = src;
    video.load();
    video.onloadeddata = () => {
      video.play().catch(() => {});
    };
  };

  // Function to find parent category for subcategory (recursive)
  const findParentCategory = async (subcategoryQuery: string) => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.success && data.data) {
        const findInCategory = (category: Category): string | null => {
          // Check direct children
          if (category.children) {
            for (const child of category.children) {
              if (child.cat_en_name === subcategoryQuery) {
                return category.cat_en_name;
              }
              // Check nested children recursively
              const found = findInCategory(child);
              if (found) {
                return category.cat_en_name;
              }
            }
          }
          return null;
        };

        for (const category of data.data) {
          const found = findInCategory(category);
          if (found) {
            return found;
          }
        }
      }
    } catch (error) {
      console.error("Error finding parent category:", error);
    }
    return null;
  };

  useEffect(() => {
    const handleCategoryData = async () => {
      if (query) {
        // Check if query exists directly in videoData
        if (videoData[query as keyof typeof videoData]) {
          const categoryData = videoData[query as keyof typeof videoData];
          setCurrentImage(categoryData.image);
        } else {
          // Query might be a subcategory, find its parent
          const parentCategory = await findParentCategory(query);
          if (
            parentCategory &&
            videoData[parentCategory as keyof typeof videoData]
          ) {
            const categoryData =
              videoData[parentCategory as keyof typeof videoData];
            setCurrentImage(categoryData.image);
          }
        }
      }
    };

    handleCategoryData();
  }, [query]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleVideoData = async () => {
      if (query) {
        let categoryData = null;

        // Check if query exists directly in videoData
        if (videoData[query as keyof typeof videoData]) {
          categoryData = videoData[
            query as keyof typeof videoData
          ] as CategoryData;
        } else {
          // Query might be a subcategory, find its parent
          const parentCategory = await findParentCategory(query);
          if (
            parentCategory &&
            videoData[parentCategory as keyof typeof videoData]
          ) {
            categoryData = videoData[
              parentCategory as keyof typeof videoData
            ] as CategoryData;
          }
        }

        if (categoryData) {
          const videos = categoryData.videos.map((video, index) => ({
            id: `${categoryData.id}-${index}`,
            videoUrl: video,
            categoryId: categoryData.id,
            categoryName: categoryData.name,
            image: categoryData.image,
          }));
          setCurrentVideos(videos);
          setCurrentImage(categoryData.image);
        }
      } else {
        const allVideos = getAllVideos();
        setCurrentVideos(allVideos);
        setCurrentImage(allVideos[0]?.image || "");
      }
      setActiveVideoIndex(0);
    };

    handleVideoData();
  }, [query]);

  const handleVideoClick = (video: VideoItem, index: number) => {
    setActiveVideoIndex(index % currentVideos.length);
    if (!isMobile) setCurrentImage(video.image);
  };

  const nextVideo = () => {
    const newIndex = (activeVideoIndex + 1) % currentVideos.length;
    setActiveVideoIndex(newIndex);
    if (isMobile && mainVideoRef.current) {
      playVideoSafely(mainVideoRef.current, currentVideos[newIndex].videoUrl);
    }
  };

  const prevVideo = () => {
    const newIndex =
      (activeVideoIndex - 1 + currentVideos.length) % currentVideos.length;
    setActiveVideoIndex(newIndex);
    if (isMobile && mainVideoRef.current) {
      playVideoSafely(mainVideoRef.current, currentVideos[newIndex].videoUrl);
    }
  };

  if (currentVideos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        ... درحال بارگذاری
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white/90 flex z-40 md:pt-24" dir="rtl">
      {isMobile ? (
        <div className="relative w-full">
          <video
            ref={mainVideoRef}
            src={currentVideos[activeVideoIndex]?.videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            loop
            autoPlay
          />
          <button
            onClick={prevVideo}
            className="absolute left-4 text-xl bottom-10 -translate-y-1/2 text-white p-3 hover:bg-black/70 transition-colors"
          >
            {/* Left arrow */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-4 text-xl bottom-10 -translate-y-1/2 text-white p-3 hover:bg-black/70 transition-colors"
          >
            {/* Right arrow */}
            <svg
              className="w-6 h-6"
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
      ) : (
        <>
          <div className="relative w-4/5">
            <Image
              key={currentImage}
              src={currentImage}
              alt="Category Image"
              width={4000}
              height={3000}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="relative w-1/5 bg-white/90 overflow-hidden">
            <div
              className="flex flex-col gap-2 pr-2 animate-scroll"
              style={{ animationDuration: getAnimationDuration() }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = "paused")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = "running")
              }
            >
              {currentVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex-shrink-0 cursor-pointer transition-opacity duration-200 ${
                    activeVideoIndex === index
                      ? "opacity-100"
                      : "brightness-75 blur-[1px]"
                  }`}
                  onClick={() => handleVideoClick(video, index)}
                  style={{ minHeight: "150px" }}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </div>
              ))}
              {currentVideos.map((video, index) => (
                <div
                  key={`${video.id}-duplicate`}
                  className="flex-shrink-0 cursor-pointer transition-opacity duration-200 brightness-75 blur-[1px]"
                  onClick={() => handleVideoClick(video, index)}
                  style={{ minHeight: "150px" }}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-gray-200">
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
