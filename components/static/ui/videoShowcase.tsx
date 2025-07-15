"use client";
import { useEffect, useRef, useState } from "react";
import { videoData } from "@/lib/homePageData";
import { VideoItem } from "@/types/type";

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoData[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const infiniteVideos = [...videoData, ...videoData, ...videoData];

  useEffect(() => {
    if (videoRef.current) videoRef.current.play();
  }, [activeVideo]);

  const handleVideoSelect = (video: VideoItem) => {
    setActiveVideo(video);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // Auto-scroll marquee
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

  return (
    <div className="relative h-screen bg-black flex z-40" dir="rtl">
      {/* Video Section */}
      <div className="relative w-4/5">
        <div className="absolute inset-0 -z-10">
          <video
            ref={videoRef}
            key={activeVideo.id}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={activeVideo.videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="relative w-[35%] bg-white/90 md:w-1/5 overflow-y-auto max-h-full py-4">
        {/* Marquee List */}
        <div
          ref={marqueeRef}
          className="relative z-10 flex flex-col gap-4 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-white/20"
        >
          {infiniteVideos.map((video, index) => (
            <div
              key={`marquee-${index}`}
              className={`flex-shrink-0 px-4 cursor-pointer transition-all duration-300 ${
                activeVideo.id === video.id
                  ? "opacity-100 scale-105 transform"
                  : "opacity-90 hover:opacity-100 hover:scale-102"
              }`}
              onClick={() => handleVideoSelect(video)}
              style={{ minHeight: "120px" }}
            >
              <div className="relative group w-full">
                <div className="w-20 h-30 md:w-full md:h-auto md:aspect-[3/4] overflow-hidden transition-shadow duration-300">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 "
                  />
                </div>

                {/* Active video indicator */}
                {activeVideo.id === video.id && (
                  <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none shadow-lg">
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar styles */}
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
