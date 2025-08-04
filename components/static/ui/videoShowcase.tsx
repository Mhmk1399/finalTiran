"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { videoData, getAllVideos } from "@/lib/homePageData";
import { VideoItem, CategoryData } from "@/types/type";
import Image from "next/image";

const VideoShowcase = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [currentVideos, setCurrentVideos] = useState<VideoItem[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    if (query && videoData[query as keyof typeof videoData]) {
      const categoryData = videoData[
        query as keyof typeof videoData
      ] as CategoryData;
      const videos = categoryData.videos.map((video, index) => ({
        id: `${categoryData.id}-${index}`,
        videoUrl: video,
        categoryId: categoryData.id,
        categoryName: categoryData.name,
        image: categoryData.image,
      }));
      setCurrentVideos(videos);
      setCurrentImage(categoryData.image);
    } else {
      const allVideos = getAllVideos();
      setCurrentVideos(allVideos);
      setCurrentImage(allVideos[0]?.image || "");
    }
    setActiveVideoIndex(0);
  }, [query]);

  // Auto-play all videos in marquee
  useEffect(() => {
    if (!isMobile) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.play().catch(() => {});
        }
      });
    }
  }, [currentVideos, isMobile]);

  // Marquee scroll
  useEffect(() => {
    if (!isMobile && marqueeRef.current && currentVideos.length > 0) {
      let animationId: number;
      const scroll = () => {
        if (marqueeRef.current) {
          marqueeRef.current.scrollTop += 0.5;
          if (
            marqueeRef.current.scrollTop >=
            marqueeRef.current.scrollHeight - marqueeRef.current.clientHeight
          ) {
            marqueeRef.current.scrollTop = 0;
          }
        }
        animationId = requestAnimationFrame(scroll);
      };
      animationId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationId);
    }
  }, [isMobile, currentVideos]);

  const handleVideoClick = useCallback(
    (video: VideoItem, index: number) => {
      setActiveVideoIndex(index % currentVideos.length);
      if (!isMobile) setCurrentImage(video.image);
    },
    [currentVideos.length, isMobile]
  );

  const nextVideo = () => {
    setActiveVideoIndex((prev) => (prev + 1) % currentVideos.length);
  };

  const prevVideo = () => {
    setActiveVideoIndex(
      (prev) => (prev - 1 + currentVideos.length) % currentVideos.length
    );
  };

  if (currentVideos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const infiniteVideos = [...currentVideos];

  return (
    <div className="relative h-screen bg-white/90 flex z-40" dir="rtl">
      {isMobile ? (
        /* Mobile: Full screen video only */
        <div className="relative w-full">
          <video
            key={currentVideos[activeVideoIndex]?.id}
            src={currentVideos[activeVideoIndex]?.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Mobile Navigation */}
          <button
            onClick={prevVideo}
            className="absolute left-4 text-xl bottom-10 -translate-y-1/2  text-white p-3  hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextVideo}
            className="absolute right-4 text-xl bottom-10 -translate-y-1/2  text-white p-3  hover:bg-black/70 transition-colors"
          >
            →
          </button>
        </div>
      ) : (
        /* Desktop: Image + Video Marquee */
        <>
          <div className="relative w-4/5">
            <Image
              src={currentImage}
              alt="Category Image"
              width={4000}
              height={3000}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-1/5 bg-white/90 overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex flex-col gap-1 pr-2 h-full overflow-y-auto w-full py-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              style={{ height: "100vh" }}
            >
              {infiniteVideos.map((video, index) => (
                <div
                  key={`${video.id}-${index}`}
                  className={`flex-shrink-0 cursor-pointer transition-opacity duration-300 ${
                    activeVideoIndex === index % currentVideos.length
                      ? "opacity-100"
                      : "opacity-80"
                  }`}
                  onClick={() => handleVideoClick(video, index)}
                  style={{ minHeight: "150px" }}
                >
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      autoPlay
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
};

export default VideoShowcase;

// Add scrollbar styles
const styles = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
