"use client";
import { useEffect } from "react";
import Image from "next/image";

interface LogoComponentProps {
  showLogo: boolean;
}

const LogoComponent = ({ showLogo }: LogoComponentProps) => {
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-white flex items-center justify-center transition-all duration-300 ease-in-out ${
        showLogo ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src="/assets/images/logo.png"
        alt="TIRAN Logo"
        width={128}
        height={128}
        className="w-32 h-32 object-contain"
        style={{
          animation: "strongPulse 1s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes strongPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LogoComponent;
