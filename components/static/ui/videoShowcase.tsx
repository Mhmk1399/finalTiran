"use client";
import { videoData } from "@/lib/homePageData";
import { VideoItem } from "@/types/type";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const VideoShowcase = ({ marqueeSpeed = 40 }) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoData[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  // const [descriptionScrollProgress, setDescriptionScrollProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const descriptionScrollRef = useRef<HTMLDivElement>(null);

  // Create infinite loop for marquee
  const infiniteVideos = [...videoData, ...videoData, ...videoData];

  const handleVideoSelect = (video: VideoItem) => {
    setActiveVideo(video);
    // Reset scroll positions when changing video
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (descriptionScrollRef.current) {
      descriptionScrollRef.current.scrollTop = 0;
    }
    setScrollProgress(0);
    // setDescriptionScrollProgress(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleMainScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    }
  };

  const handleDescriptionScroll = () => {
    if (descriptionScrollRef.current) {
      const { scrollHeight, clientHeight } = descriptionScrollRef.current;
      const maxScroll = Math.max(scrollHeight - clientHeight, 1);
      console.log(maxScroll);
      // setDescriptionScrollProgress(progress);
    }
  };
  const handleCloseDescription = () => {
    // Smoothly scroll back to top to hide description
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Reset description scroll position
    if (descriptionScrollRef.current) {
      descriptionScrollRef.current.scrollTop = 0;
    }
    // setDescriptionScrollProgress(0);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [activeVideo]);

  // Calculate dynamic values based on scroll progress
  const descriptionOpacity = Math.min(scrollProgress * 2, 1);
  const descriptionTranslateY = Math.max(100 - scrollProgress * 100, 0);
  const blurIntensity = Math.min(scrollProgress * 15, 12);
  const overlayOpacity = Math.min(scrollProgress * 0.8, 0.7);
  const isDescriptionVisible = scrollProgress > 0.3;

  return (
    <div className="min-h-screen z-999999 inset-0 fixed bg-black flex">
      {" "}
      {/* Video Section - 80% */}
      <div className="w-4/5 relative">
        {/* Fixed Video Background */}
        <div className="absolute inset-0">
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
        <div className="absolute left-1/2 top-8 md:left-1/3 md:right-2 transform  -translate-x-1/2 z-100">
          <Link href="/shop">
            <motion.button
              className="group relative overflow-hidden cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

              {/* Button Content */}
              <div className="relative flex items-center gap-3">
                <span className="md:text-lg text-nowrap font-semibold tracking-wide">
                  مشاهده فروشگاه
                </span>

                {/* Arrow Icon */}
                <motion.svg
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 4 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </div>

              {/* Pulse Effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
        </div>

        {/* Scrollable Container for triggering description */}
        <div
          ref={scrollContainerRef}
          className="relative h-screen overflow-y-auto scrollbar-hide z-20"
          onScroll={handleMainScroll}
          style={{ pointerEvents: isDescriptionVisible ? "none" : "auto" }}
        >
          {/* Invisible spacer to enable scrolling */}
          <div className="h-[200vh]"></div>
        </div>

        {/* Description Section - Slides up over video */}
        <div
          className="fixed bottom-0 left-0 w-4/5 z-30"
          style={{
            transform: `translateY(${descriptionTranslateY}%)`,
            opacity: descriptionOpacity,
            pointerEvents: isDescriptionVisible ? "auto" : "none",
          }}
        >
          {/* Background blur overlay */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurIntensity}px)`,
              background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${
                overlayOpacity * 0.3
              }))`,
            }}
          ></div>

          {/* Close Button */}
          {isDescriptionVisible && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
              <button
                onClick={handleCloseDescription}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                aria-label="Close description"
              >
                <svg
                  className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
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

          {/* Scrollable Content */}
          <div
            ref={descriptionScrollRef}
            className="relative z-10 h-full max-h-screen overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40"
            onScroll={handleDescriptionScroll}
          >
            <div className="px-8 py-12 pt-20">
              {" "}
              {/* Added pt-20 for close button space */}
              <div className="max-w-3xl mx-auto">
                {" "}
                {/* Added mx-auto for centering */}
                <div className="mb-4 text-center">
                  {" "}
                  {/* Added text-center */}
                  <span className="text-white/60 text-sm uppercase tracking-wider">
                    {activeVideo.category}
                  </span>
                </div>
                <h3 className="text-white text-3xl font-light mb-8 tracking-wide leading-tight text-center">
                  {" "}
                  {/* Added text-center */}
                  {activeVideo.title}
                </h3>
                <div className="text-white/90 text-lg leading-relaxed space-y-6 text-justify">
                  {" "}
                  {/* Added text-justify */}
                  {activeVideo.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="transform transition-all duration-700 ease-out"
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
                        {paragraph}
                      </p>
                    ))}
                </div>
                {/* Bottom padding for better scrolling */}
                <div className="h-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Marquee Section - 20% */}
      <div className="w-1/5 bg-black">
        <div className="min-h-screen overflow-hidden py-4">
          <div
            className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40"
            style={{
              animation: `verticalMarquee ${marqueeSpeed}s linear infinite`,
              animationPlayState: "running",
              height: `${infiniteVideos.length * 100}px`, // Dynamic height based on content
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = "paused";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = "running";
            }}
          >
            {infiniteVideos.map((video, index) => (
              <div
                key={`marquee-${index}`}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300 px-4 ${
                  activeVideo.id === video.id
                    ? "opacity-100 scale-105"
                    : "opacity-60 hover:opacity-80"
                }`}
                onClick={() => handleVideoSelect(video)}
                style={{ minHeight: "120px" }} // Consistent item height
              >
                <div className="relative group">
                  <div className="aspect-[3/7] md:aspect-[3/4] overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Active indicator */}
                  {activeVideo.id === video.id && (
                    <div className="absolute inset-0 border-2 border-white rounded-lg"></div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg"></div>

                  {/* Title */}
                  <div className="mt-2">
                    {/* <p className="text-white text-xs font-light tracking-wide truncate">
                      {video.title}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes verticalMarquee {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(
              -${(100 * videoData.length) / infiniteVideos.length}%
            );
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-track-transparent {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
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
