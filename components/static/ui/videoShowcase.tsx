"use client";
import { useEffect, useRef, useState } from "react";
import { videoData } from "@/lib/homePageData";
import { VideoItem } from "@/types/type";

const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoData[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const descriptionScrollRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const infiniteVideos = [...videoData, ...videoData, ...videoData];

  useEffect(() => {
    if (videoRef.current) videoRef.current.play();
  }, [activeVideo]);

  const handleVideoSelect = (video: VideoItem) => {
    setActiveVideo(video);

    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ top: 0 });
      descriptionScrollRef.current?.scrollTo({ top: 0 });
    });

    setScrollProgress(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMainScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
  };

  const handleCloseDescription = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    descriptionScrollRef.current?.scrollTo({ top: 0 });
  };

  const descriptionOpacity = Math.min(scrollProgress * 2, 1);
  const descriptionTranslateY = Math.max(100 - scrollProgress * 100, 0);
  const blurIntensity = Math.min(scrollProgress * 15, 12);
  const overlayOpacity = Math.min(scrollProgress * 0.8, 0.7);
  const isDescriptionVisible = scrollProgress > 0.3;

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
    <div className="relative h-screen bg-black flex z-40">
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

        {/* Blur overlay for mobile */}
        <div className="md:hidden absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

        {/* Scrollable Area */}
        <div
          ref={scrollContainerRef}
          className="relative h-screen overflow-y-auto scrollbar-hide"
          onScroll={handleMainScroll}
        >
          <div className="h-[160vh]" />
        </div>

        {/* Description Overlay */}
        <div
          className="absolute bottom-0 left-0 w-full transition-all duration-500 z-30"
          style={{
            transform: `translateY(${descriptionTranslateY}%)`,
            opacity: descriptionOpacity,
            pointerEvents: isDescriptionVisible ? "auto" : "none",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurIntensity}px)`,
              background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${
                overlayOpacity * 0.3
              }))`,
            }}
          ></div>

          {isDescriptionVisible && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40">
              <button
                onClick={handleCloseDescription}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          <div
            ref={descriptionScrollRef}
            className="relative z-10 max-h-[70vh] overflow-y-auto px-8 py-16 scrollbar-thin scrollbar-thumb-white/20"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-white/60 text-sm uppercase text-center">
                {activeVideo.category}
              </p>
              <h3 className="text-white text-3xl font-light text-center">
                {activeVideo.title}
              </h3>
              {activeVideo.description.split("\n").map((para, index) => (
                <p
                  key={index}
                  className="text-white/90 text-lg leading-relaxed text-justify transition-all"
                  style={{
                    opacity: Math.min(
                      (scrollProgress - 0.2 - index * 0.05) * 4,
                      1
                    ),
                    transform: `translateY(${Math.max(
                      15 - (scrollProgress - index * 0.05) * 30,
                      0
                    )}px)`,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
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
              className={`flex-shrink-0 px-4 cursor-pointer ${
                activeVideo.id === video.id
                  ? "opacity-100 scale-105"
                  : "opacity-90 hover:opacity-80"
              } transition-all`}
              onClick={() => handleVideoSelect(video)}
              style={{ minHeight: "120px" }}
            >
              <div className="relative group w-full">
                <div className="w-20 h-30 md:w-full md:h-auto md:aspect-[3/4] overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 "
                  />
                </div>

                {activeVideo.id === video.id && (
                  <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

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
      `}</style>
    </div>
  );
};

export default VideoShowcase;
