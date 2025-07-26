"use client";
import { useEffect, useRef, useState } from "react";
import { videoData } from "@/lib/homePageData";
import { VideoItem } from "@/types/type";
import Image from "next/image";

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoData[0]);
  const [fade, setFade] = useState(true); // برای افکت
  const marqueeRef = useRef<HTMLDivElement>(null);

  const infiniteVideos = [...videoData, ...videoData, ...videoData];

  // ✅ اسلاید اتوماتیک فقط در موبایل/تبلت با fade

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        // اول fade-out
        setFade(false);
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % videoData.length;
          setActiveVideo(videoData[currentIndex]);
          // بعد از تغییر عکس fade-in
          setFade(true);
        }, 800); // زمان fade-out
      }, 5000); // هر ۳ ثانیه تغییر

      return () => clearInterval(interval);
    }
  }, []);

  // ✅ marquee auto-scroll مثل قبل
  useEffect(() => {
    let animationFrame: number;
    const scrollMarquee = () => {
      if (marqueeRef.current) {
        marqueeRef.current.scrollTop += 0.5;
        if (
          marqueeRef.current.scrollTop + marqueeRef.current.clientHeight >=
          marqueeRef.current.scrollHeight
        ) {
          marqueeRef.current.scrollTop = 0;
        }
      }
      animationFrame = requestAnimationFrame(scrollMarquee);
    };
    animationFrame = requestAnimationFrame(scrollMarquee);

    const el = marqueeRef.current;
    const pause = () => cancelAnimationFrame(animationFrame);
    const resume = () =>
      (animationFrame = requestAnimationFrame(scrollMarquee));

    el?.addEventListener("mouseenter", pause);
    el?.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationFrame);
      el?.removeEventListener("mouseenter", pause);
      el?.removeEventListener("mouseleave", resume);
    };
  }, []);

  const handleVideoSelect = (video: VideoItem) => {
    setActiveVideo(video);
  };

  return (
    <div className="relative h-screen bg-white/90 flex z-40" dir="rtl">
      {/* Main Image Section */}
      <div className="relative w-full lg:w-4/5">
        <div className="absolute inset-0 -z-10">
          <Image
            src={activeVideo.thumbnail}
            alt={activeVideo.title}
            width={4000}
            height={3000}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Marquee Section - فقط دسکتاپ */}
      <div className="hidden lg:block relative w-[35%] bg-white/90 md:w-1/5 overflow-y-auto max-h-full py-4">
        <div
          ref={marqueeRef}
          className="relative z-10 flex flex-col gap-3 overflow-y-auto h-full  lg:-ml-1.5 scrollbar-thin scrollbar-thumb-white/20"
        >
          {infiniteVideos.map((video, index) => (
            <div
              key={`marquee-${index}`}
              className={`flex-shrink-0 pr-3 cursor-pointer transition-all duration-300 ${
                activeVideo.id === video.id
                  ? "opacity-100  transform"
                  : "opacity-90 hover:opacity-100 hover:scale-102"
              }`}
              onClick={() => handleVideoSelect(video)}
              style={{ minHeight: "120px" }}
            >
              <div className="relative group w-full">
                <div className="w-20 h-30 md:w-[100%] md:h-auto md:aspect-[3/4] overflow-hidden transition-shadow duration-300">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                </div>

                {activeVideo.id === video.id && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-black/50 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default VideoShowcase;
