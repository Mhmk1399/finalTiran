"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoSlide {
  id: number;
  src: string;
  title: string;
  description: string;
}

const videoSlides: VideoSlide[] = [
  {
    id: 1,
    src: "/assets/video/videoslide2.mp4",
    title: "مجموعه ی چرم فرش",
    description: "استایل جور دیگر",
  },
  {
    id: 2,
    src: "/assets/video/videoslide1.mp4",
    title: "Product Demo",
    description: "استایل جور دیگر",
  },
];

export default function VideoScrollScale() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 2,
          ease: "power2.out",
        }
      );
    }

    if (videoWrapperRef.current) {
      gsap.to(videoWrapperRef.current, {
        scale: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  const nextSlide = () => {
    console.log("Next clicked, current:", currentSlide);
    setCurrentSlide((prev) => {
      const next = (prev + 1) % videoSlides.length;
      console.log("Next slide will be:", next);
      return next;
    });
  };

  const prevSlide = () => {
    console.log("Prev clicked, current:", currentSlide);
    setCurrentSlide((prev) => {
      const next = (prev - 1 + videoSlides.length) % videoSlides.length;
      console.log("Prev slide will be:", next);
      return next;
    });
  };

  useEffect(() => {
    console.log("Current slide changed to:", currentSlide);
    const video = videoRef.current;
    if (video) {
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Video play failed:", error);
        });
      }
    }
  }, [currentSlide]);

  const handleVideoLoad = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  };

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: "url('/assets/images/texture.png')",
        backgroundSize: "cover",
      }}
    >
      <div
        ref={videoWrapperRef}
        className="relative w-full h-full  overflow-hidden"
        style={{ transformOrigin: "center center" }}
      >
        <video
          ref={videoRef}
          key={currentSlide}
          src={videoSlides[currentSlide].src}
          autoPlay
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          className="w-full h-full object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-end justify-center mb-28 z-30">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl md:text-3xl font-bold mb-4 drop-shadow-lg">
              {videoSlides[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
              {videoSlides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3  transition-all"
        >
          ←
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3  transition-all"
        >
          →
        </button>

        {/* Dots Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
          {videoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div> */}

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/10   to-transparent z-40"
        />
      </div>
    </div>
  );
}
