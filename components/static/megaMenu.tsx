import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MegaMenuProps } from "@/types/type";

const MegaMenu: React.FC<MegaMenuProps> = ({
  categories,
  hoveredCategory,
  setHoveredCategory,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<number | null>(
    null
  );
  console.log(hoveredSubcategory);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const megaMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" as const },
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" as const },
    },
  };

  const categoryImageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.1 },
    },
  };

  const childCategoryVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.05 * custom },
    }),
  };

  const thirdLevelVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const thirdLevelItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {hoveredCategory !== null && (
        <motion.div
          className="fixed right-0 w-screen bg-[#fcf7f1] shadow-lg z-9999"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={megaMenuVariants}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
          style={{ top: "100%" }}
        >
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {categories[hoveredCategory] && (
              <div className="grid grid-cols-12 gap-6">
                {/* Category Image */}
                <motion.div
                  className="col-span-3 flex flex-col items-center justify-center"
                  variants={categoryImageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-black text-xl font-medium mb-2 pb-2 border-b border-gray-400 w-fit px-4 ml-auto text-right">
                    {categories[hoveredCategory].cat_name}
                  </h3>

                  <div className="relative w-64 h-36 overflow-hidden mb-3 shadow-md transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src={
                        categories[hoveredCategory].src ||
                        "/assets/images/imagegrow.avif"
                      }
                      alt={categories[hoveredCategory].cat_name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  <Link
                    href={`/shop?query=${categories[hoveredCategory].slug}`}
                    className="text-gray-900 hover:text-black font-medium text-sm flex items-center group"
                  >
                    <span className="relative">
                      همه {categories[hoveredCategory].cat_name} ها
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </motion.div>

                {/* Subcategories */}
                <div className="col-span-7 mt-4 mr-24">
                  <div className="grid grid-cols-3  justify-start items-start gap-1">
                    {categories[hoveredCategory].children &&
                      categories[hoveredCategory].children.map(
                        (subcategory, index) => (
                          <motion.div
                            key={subcategory.id}
                            custom={index}
                            variants={childCategoryVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col"
                            onMouseEnter={() => setHoveredSubcategory(index)}
                            onMouseLeave={() => setHoveredSubcategory(null)}
                          >
                            <div className="text-gray-900 font-bold text-[12px] mb-3 hover:text-black transition-all w-fit duration-300  relative group">
                              <span className="inline-block">
                                {subcategory.cat_name}
                              </span>
                            </div>

                            {/* Third level categories if they exist */}
                            {subcategory.children &&
                              subcategory.children.length > 0 && (
                                <motion.div
                                  className="flex flex-col space-y-2"
                                  variants={thirdLevelVariants}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  {subcategory.children.map(
                                    (thirdLevel, idx) => (
                                      <motion.div
                                        key={idx}
                                        variants={thirdLevelItemVariants}
                                        className="overflow-hidden"
                                      >
                                        <Link
                                          href={`/shop?query=${thirdLevel.slug}`}
                                          className="text-gray-600 pb-2 text-sm hover:text-black w-fit hover:pr-1 transition-all duration-200 block relative group"
                                        >
                                          <span className="inline-block">
                                            {thirdLevel.cat_name}
                                          </span>
                                          <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                      </motion.div>
                                    )
                                  )}
                                </motion.div>
                              )}
                          </motion.div>
                        )
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
