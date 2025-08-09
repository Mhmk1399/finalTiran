"use client";
import { useEffect, useState } from "react";

const videoSlides = {
  src: "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/NYVMk7Mvnl/origin_8WmQvnpZ3v8Oo2f0Qwkz6ZBuEVpki3dkGO7ScAKK.mp4",
  mobileSrc:
    "https://tiranstyle.arvanvod.ir/lD6vqZnXY3/xqOg6q0Rd8/origin_5ft3HKzQiAzHw6trjTp6DwR1ok8KxPOsXId25BFl.mp4",
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
          loop
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
