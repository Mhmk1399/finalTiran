// Mixed Grid Card Component (Updated for marquee)
import Image from "next/image";
import { MixedGridCardProps } from "@/types/type";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const MixedGridCardMobile: React.FC<MixedGridCardProps> = ({
  category,
  isHovered,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showColorImage, setShowColorImage] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-full overflow-hidden shadow-lg group transform transition-all duration-300`}
      onTouchStart={() => {
        setShowColorImage(true);
        setIsTouched(true);
      }}
      onTouchEnd={() => {
        setShowColorImage(false);
        setIsTouched(false);
      }}
      onMouseEnter={() => setShowColorImage(true)}
      onMouseLeave={() => setShowColorImage(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        {/* Default B&W Image */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: showColorImage || isTouched ? 0 : 1,
            scale: isHovered || isTouched ? 1.1 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link href="/video">
            <Image
              src={category.imageDefault}
              alt={category.title}
              fill
              className="object-cover"
              style={{
                filter: "grayscale(100%) contrast(1.1) brightness(0.9)",
              }}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 80vw, 25vw"
            />
          </Link>
        </motion.div>

        {/* Hover/Touch Color Image */}
        <AnimatePresence>
          {(isHovered || isTouched) && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: 1,
                scale: 1.1,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={category.imageHover}
                alt={`${category.title} - Color`}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Glow Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${category.color}30 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered || isTouched ? 1 : 0,
          scale: isHovered || isTouched ? 1.1 : 0.9,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 text-white z-10"
        dir="rtl"
      >
        <motion.div
          animate={{
            y: isHovered || isTouched ? -8 : 0,
            scale: isHovered || isTouched ? 1.05 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.h3
            className="text-base font-bold mb-2"
            animate={{
              color:
                isHovered || isTouched
                  ? category.color || "#8B5CF6"
                  : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
          >
            {category.title}
          </motion.h3>

          {/* Subtitle or description if available */}
          {category.description && (
            <motion.p
              className="text-sm opacity-80"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered || isTouched ? 1 : 0,
                height: isHovered || isTouched ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {category.description}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Enhanced Shine Effect */}
      <AnimatePresence>
        {(isHovered || isTouched) && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              animate={{
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch Ripple Effect */}
      <AnimatePresence>
        {isTouched && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(circle at center, ${category.color}40 0%, transparent 60%)`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MixedGridCardMobile;
