"use client";
import {  useEffect, useState } from "react";

const videoSlides = {
  src: "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/aqYWNXrvpA/origin_X2X6eocORxrdmKJZmP72TmhiZVpi352VXTYuf79J.mp4",
  mobileSrc: "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/aqYWNXrvpA/origin_X2X6eocORxrdmKJZmP72TmhiZVpi352VXTYuf79J.mp4",
  title: "استایل جور دیگر",
};

export default function VideoSection() {
  const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
  
      checkMobile();
      window.addEventListener("resize", checkMobile);
  
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage: "url('/assets/images/texture.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full h-full  overflow-hidden">
        <video
          src={isMobile ? videoSlides.mobileSrc : videoSlides.src}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-end justify-end mb-6 mr-18  z-30">
          <div className="text-center text-white ">
            <h2 className="text-4xl md:text-3xl font-bold mb-4 drop-shadow-lg">
              {videoSlides.title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
