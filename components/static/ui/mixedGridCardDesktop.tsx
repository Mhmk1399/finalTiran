// Mixed Grid Card Component (Updated for static positioning)
import Image from "next/image";
import { MixedGridCardProps } from "@/types/type";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MixedGridCardDesktop: React.FC<MixedGridCardProps> = ({
  category,
  isHovered,
  size,
  position, // Add position prop
  zIndex, // Add zIndex prop
}) => {
  const navigate = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showColorImage, setShowColorImage] = useState(false);
  console.log(imageLoaded);

  const handleRoute = () => {
    navigate.push("/video");
  };

  return (
    // <Link href="/video">
    <motion.div
      className={`absolute overflow-hidden shadow-lg group transform transition-all duration-300 cursor-pointer`}
      onClick={handleRoute}
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        width: position?.width || 200,
        height: position?.height || 300,
        zIndex: zIndex || 1,
      }}
      onMouseEnter={() => setShowColorImage(true)}
      onMouseLeave={() => setShowColorImage(false)}
      whileHover={{
        scale: 1.05,
        zIndex: 100,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        {/* Default B&W Image */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: showColorImage ? 0 : 1,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {" "}
          <Image
            src={category.imageDefault}
            alt={category.title}
            fill
            className="object-cover"
            style={{
              filter: "grayscale(100%) contrast(1.1) brightness(0.9)",
            }}
            onClick={handleRoute}
            onLoad={() => setImageLoaded(true)}
            sizes={`(max-width: 768px) 50vw, ${
              size === "medium" ? "25vw" : size === "wide" ? "50vw" : "12.5vw"
            }`}
          />
        </motion.div>

        {/* Hover Color Image */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: 1,
                scale: 1.15,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationStart={() => setShowColorImage(true)}
              onAnimationComplete={() => setShowColorImage(false)}
            >
              <Image
                src={category.imageHover}
                alt={`${category.title} - Color`}
                fill
                className="object-cover rounded-lg"
                onClick={handleRoute}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `radial-gradient(circle at center, ${category.color}20 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white z-10`}
        dir="rtl"
      >
        <motion.div
          animate={{
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.h3
            className={`text-sm md:text-base font-bold`}
            animate={{
              color: isHovered ? category.color || "#8B5CF6" : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
          >
            {category.title}
          </motion.h3>
        </motion.div>
      </div>

      {/* Hover Shine Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    // </Link>
  );
};

export default MixedGridCardDesktop;
