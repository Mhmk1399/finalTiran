"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoSlide {
  id: number;
  src: string;
  mobileSrc: string;
  title: string;
  description: string;
}

interface VideoScrollScaleProps {
  transitionImage?: string;
  isTransitioning?: boolean;
}

const videoSlides: VideoSlide[] = [
  {
    id: 1,
    src: "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/aqYWNXrvpA/origin_X2X6eocORxrdmKJZmP72TmhiZVpi352VXTYuf79J.mp4",
    mobileSrc:
      "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/JgkjrgQM1L/origin_cmnAgrjNDQIW1v9QWIRJylVyk5sZLLZ1EUVqhcL6.mp4",
    title: "مجموعه ی چرم فرش",
    description: "استایل جور دیگر",
  },
  {
    id: 2,
    src: "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/NYVMk7Mvnl/origin_8WmQvnpZ3v8Oo2f0Qwkz6ZBuEVpki3dkGO7ScAKK.mp4",
    mobileSrc:
      "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/JgkjrgQM1L/origin_cmnAgrjNDQIW1v9QWIRJylVyk5sZLLZ1EUVqhcL6.mp4",
    title: "تیران استایل",
    description: "استایل جور دیگر",
  },
];

export default function VideoScrollScale({
  transitionImage,
  isTransitioning = false,
}: VideoScrollScaleProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTransitionImage, setShowTransitionImage] =
    useState(isTransitioning);
  const [videoVisible, setVideoVisible] = useState(!isTransitioning);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const transitionImageRef = useRef<HTMLDivElement | null>(null);

  const playVideoSafely = (video: HTMLVideoElement, src: string) => {
    video.pause();
    video.src = src;
    video.load();
    video.onloadeddata = () => {
      video.play().catch(() => {});
    };
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isTransitioning && transitionImage) {
      const animateTransition = async () => {
        setShowTransitionImage(true);
        setVideoVisible(false);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (transitionImageRef.current) {
          gsap.to(transitionImageRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
              setShowTransitionImage(false);
              setVideoVisible(true);
              if (videoWrapperRef.current) {
                gsap.fromTo(
                  videoWrapperRef.current,
                  { scale: 1.1, opacity: 0 },
                  { scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
                );
              }
            },
          });
        }
      };
      animateTransition();
    } else {
      setVideoVisible(true);
    }
  }, [isTransitioning, transitionImage]);

  useEffect(() => {
    if (videoVisible && !isLoaded) {
      setIsLoaded(true);
      if (videoWrapperRef.current) {
        gsap.fromTo(
          videoWrapperRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: "power2.out" }
        );
      }
    }

    if (overlayRef.current && videoVisible) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 2, ease: "power2.out", delay: 0.5 }
      );
    }

    if (videoWrapperRef.current && videoVisible) {
      gsap.to(videoWrapperRef.current, {
        scale: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, [videoVisible, isLoaded]);

  const nextSlide = () => {
    const nextSlideIndex = (currentSlide + 1) % videoSlides.length;
    const nextVideoRef = activeVideo === 0 ? videoRef2 : videoRef1;
    const slide = videoSlides[nextSlideIndex];

    if (nextVideoRef.current) {
      playVideoSafely(
        nextVideoRef.current,
        isMobile ? slide.mobileSrc : slide.src
      );
    }
    setCurrentSlide(nextSlideIndex);
    setActiveVideo(activeVideo === 0 ? 1 : 0);
  };

  const prevSlide = () => {
    const prevSlideIndex =
      (currentSlide - 1 + videoSlides.length) % videoSlides.length;
    const nextVideoRef = activeVideo === 0 ? videoRef2 : videoRef1;
    const slide = videoSlides[prevSlideIndex];

    if (nextVideoRef.current) {
      playVideoSafely(
        nextVideoRef.current,
        isMobile ? slide.mobileSrc : slide.src
      );
    }
    setCurrentSlide(prevSlideIndex);
    setActiveVideo(activeVideo === 0 ? 1 : 0);
  };

  useEffect(() => {
    const loadInitialVideos = () => {
      if (videoRef1.current) {
        playVideoSafely(
          videoRef1.current,
          isMobile ? videoSlides[0].mobileSrc : videoSlides[0].src
        );
      }

      if (videoRef2.current && videoSlides[1]) {
        videoRef2.current.pause();
        videoRef2.current.src = isMobile
          ? videoSlides[1].mobileSrc
          : videoSlides[1].src;
        videoRef2.current.load();
      }

      setVideosLoaded(true);
    };

    loadInitialVideos();
  }, [isMobile]);

  return (
    <div className="h-screen relative">
      {showTransitionImage && transitionImage && (
        <div
          ref={transitionImageRef}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          <img
            src={transitionImage}
            alt="Transition"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>
      )}

      <div
        ref={videoWrapperRef}
        className="relative w-full h-full overflow-hidden"
        style={{ transformOrigin: "center center", opacity: 0 }}
      >
        {!videosLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        <video
          ref={videoRef1}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={nextSlide}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
            activeVideo === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ willChange: "transform" }}
        />
        <video
          ref={videoRef2}
          muted
          playsInline
          preload="metadata"
          onEnded={nextSlide}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
            activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ willChange: "transform" }}
        />

        <div className="absolute inset-0 flex items-end justify-center mb-36 md:mb-28 z-30">
          <div className="text-center text-white px-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
              {videoSlides[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
              {videoSlides[currentSlide].description}
            </p>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hover:bg-black/20 text-white p-3  transition-all"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hover:bg-black/20 text-white p-3  transition-all"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-40"
        />
      </div>
    </div>
  );
}
