"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollVideo: React.FC<{ src: string }> = ({
  src = "/assets/video/bag1.mp4",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollDirection = useRef<"up" | "down">("down");
  const lastScrollTop = useRef(0);

  // Framer Motion variants for subtle scale/rotation on scroll
  const containerVariants = {
    scrollingDown: {
      transition: { duration: 0.1, ease: "easeOut" },
    },
    scrollingUp: {
      transition: { duration: 0.1, ease: "easeOut" },
    },
    idle: {
      rotateZ: 0,
      transition: { duration: 0.1, ease: "backOut" },
    },
  };

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const container = containerRef.current;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const handleLoadedMetadata = () => {
      const duration = video.duration;

      // Define scroll length for pinning (adjust multiplier for scroll length)
      const scrollLength = window.innerHeight * 3; // 3x viewport height for scroll pin duration

      // Pin container & scrub video playback synced to scroll progress
      gsap.to(video, {
        currentTime: duration,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollLength}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1, // helps with smoother pinning
          onUpdate: () => {
            // Scroll direction detection
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop.current) {
              scrollDirection.current = "down";
            } else if (st < lastScrollTop.current) {
              scrollDirection.current = "up";
            }
            lastScrollTop.current = st <= 0 ? 0 : st;

            setIsScrolling(true);

            clearTimeout((window as any)._scrollTimeout);
            (window as any)._scrollTimeout = setTimeout(() => {
              setIsScrolling(false);  
            }, 50);
          },
        },
      });

      // Optional: subtle parallax on video container for style
      gsap.to(videoContainerRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: 0.1,
          pin: false,
        },
      });
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      clearTimeout((window as any)._scrollTimeout);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="w-full py-10 bg-black relative overflow-hidden"
    >
      <div className="mx-auto max-w-4xl px-4 relative">
        <motion.div
          ref={videoContainerRef}
          className="relative"
          initial="idle"
          animate={
            isScrolling
              ? scrollDirection.current === "down"
                ? "scrollingDown"
                : "scrollingUp"
              : "idle"
          }
          variants={containerVariants}
        >
          <video
            ref={videoRef}
            src={src}
            className="w-full h-auto rounded-lg shadow-xl transform-origin-center"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SmoothScrollVideo;
