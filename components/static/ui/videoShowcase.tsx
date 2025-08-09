"use client";
import { useEffect, useState } from "react";
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

  const getAnimationDuration = () => {
    const videoCount = currentVideos.length;
    if (videoCount <= 3) return "35s";
    if (videoCount <= 6) return "35s";
    if (videoCount <= 9) return "35s";
    return "50s";
  };

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

  const handleVideoClick = (video: VideoItem, index: number) => {
    setActiveVideoIndex(index % currentVideos.length);
    if (!isMobile) setCurrentImage(video.image);
  };

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
        ... درحال بارگذاری
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white/90 flex z-40 md:pt-24" dir="rtl">
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
              className="flex flex-col gap-2 pr-2 animate-scroll"
              style={{
                animationDuration: getAnimationDuration(),
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = "paused")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = "running")
              }
            >
              {/* First set of videos */}
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
              {/* Duplicate set for seamless loop */}
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
};

export default VideoShowcase;
