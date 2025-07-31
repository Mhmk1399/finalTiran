"use client";

const videoSlides = {
  src: "/assets/video/videoslide1.mp4",
  title: "استایل جور دیگر",
};

export default function VideoSection() {
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
          src={videoSlides.src}
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
