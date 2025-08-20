"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Signature from "../global/signature";
import { Category } from "@/types/type";
import {
  Accsses,
  customersServices,
  Help,
  socialLinks,
} from "@/lib/footerData";
import { maneli } from "@/next-persian-fonts/maneli";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const Footer = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category"); // Adjust your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Handle different possible data structures
        let categoriesArray: Category[] = [];

        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else if (data && typeof data === "object") {
          // If data is an object, try to find an array property
          const arrayProperty = Object.values(data).find((value) =>
            Array.isArray(value)
          );
          if (arrayProperty) {
            categoriesArray = arrayProperty as Category[];
          }
        }

        // Since your categories don't have children property, show all categories
        // Filter out categories that have parent (show only parent categories)
        const parentCategories = categoriesArray.filter(
          (category: Category) => category.parent === null
        );

        setCategories(parentCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform values for parallax effects

  if (pathname === "/admin" || pathname === "/auth" || pathname === "/about") {
    return null;
  }

  return (
    <>
      {/* Main Footer */}
      <footer dir="rtl" className="bg-white text-white min-h-full lg:mx-20">
        {/* Wave SVG Divider */}
        <motion.div
          className="container mx-auto px-8 pt-10 pb-12 border-t border-dashed border-gray-400/80"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Section - Takes more space */}

          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row items-center lg:items-start mb-12 justify-between gap-6 lg:gap-0"
          >
            <motion.div
              transition={{ type: "spring" as const, stiffness: 300 }}
              className="space-y-4 md:space-y-2 w-full lg:w-auto"
            >
              <Link
                href="/"
                className="flex items-center justify-center lg:justify-start group"
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={200}
                  height={60}
                  className="h-10 w-70 mb-4 -mt-1  transition-all duration-300 group-hover:brightness-110"
                />
              </Link>
              <motion.p className={`${maneli.className} text-black`}>
                استایل جور دیگر
              </motion.p>
              <div className="max-w-5xl text-center lg:text-right mx-auto lg:mr-auto lg:ml-0">
                <p className="text-gray-600 text-xs md:text-sm lg:text-base leading-relaxed font-light px-4 lg:px-0">
                  تیران استایل فقط یک برند نیست؛ یک نگاه تازه است به زندگی‌ای که
                  ریشه در اصالت دارد و رو به آینده حرکت می‌کند.
                  <br />
                  ما از دل هنر، فرهنگ و وقار ایرانی الهام می‌گیریم تا محصولاتی
                  خلق کنیم که فراتر از زیبایی، معنا داشته باشند.
                  <br />
                  محصولاتی برای کسانی که خاص‌بودن را می‌فهمند، به ظرافت اهمیت
                  می‌دهند و به اصالت وفادارند.
                  <br />
                  در تیران استایل، سبک زندگی اصیل ایرانی را نه بازسازی، که
                  بازآفرینی می‌کنیم؛ با نگاهی تازه، برای سلیقه‌هایی که عمیق‌تر
                  می‌بینند.{" "}
                </p>
              </div>
            </motion.div>

            {/* Social Links with better spacing */}
            <div className="flex items-center justify-center lg:justify-end gap-3 lg:gap-4 order-first lg:order-last">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -3,
                      scale: 1.1,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-900 hover:bg-gray-900 text-gray-50 hover:text-white flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <IconComponent
                      size={16}
                      className="lg:w-5 lg:h-5 transition-transform duration-300 group-hover:scale-110"
                    />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* accsess Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <div className="relative">
                <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                  دسترسی سریع
                </h3>
              </div>

              <nav className="space-y-4">
                {Accsses.map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm"
                    >
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        whileHover={{ width: 12, opacity: 1 }}
                        className="h-px bg-amber-500 mr-3 transition-all duration-300"
                      />
                      <span className="group-hover:font-medium transition-all duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* customersServices Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <div className="relative">
                <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                  خدمات مشتریان
                </h3>
              </div>

              <nav className="space-y-4">
                {customersServices.map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm"
                    >
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        whileHover={{ width: 12, opacity: 1 }}
                        className="h-px bg-amber-500 mr-3 transition-all duration-300"
                      />
                      <span className="group-hover:font-medium transition-all duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Help Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <div className="relative">
                <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                  راهنما
                </h3>
              </div>

              <nav className="space-y-4">
                {Help.map((link, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    transition={{
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 25,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm"
                    >
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        whileHover={{ width: 12, opacity: 1 }}
                        className="h-px bg-amber-500 mr-3 transition-all duration-300"
                      />
                      <span className="group-hover:font-medium transition-all duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Categories Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <div className="relative">
                <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                  دسته‌بندی‌ها
                </h3>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="h-3 bg-gray-100 rounded-full animate-pulse"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <nav className="space-y-4">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <Link
                        href={`/shop?query=${encodeURIComponent(
                          category.cat_en_name
                        )}`}
                        className="group flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm"
                      >
                        <div className="flex items-center">
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            whileHover={{ width: 12, opacity: 1 }}
                            className="h-px bg-blue-500 mr-3 transition-all duration-300"
                          />
                          <span className="group-hover:font-medium transition-all duration-300">
                            {category.cat_name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* {categories.length > 4 && (
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="pt-2 border-t border-gray-100"
                    >
                      <Link
                        href="/shop"
                        className="group flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 text-sm font-medium"
                      >
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          whileHover={{ width: 12, opacity: 1 }}
                          className="h-px bg-blue-500 mr-3 transition-all duration-300"
                        />
                        مشاهده همه
                        <svg
                          className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1"
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
                      </Link>
                    </motion.div>
                  )} */}
                </nav>
              ) : (
                <p className="text-gray-500 text-sm p-4 rounded-lg text-center">
                  دسته‌بندی‌ای یافت نشد
                </p>
              )}
            </motion.div>

            {/* Image enamad and trust Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 col-span-2 space-y-6 mr-auto"
            >
              <div className="relative"></div>
              <div className="flex flex-row lg:flex-row gap-4 items-center justify-center">
                <Image
                  src="/assets/images/enemad.png"
                  alt="Enamad"
                  width={200}
                  height={200}
                  className="w-30 md:w-full h-30 object-contain"
                />
                <Image
                  src="/assets/images/meliNeshan.png"
                  alt="Enamad"
                  width={100}
                  height={100}
                  className="w-30 md:w-full h-30 object-contain"
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Section with better spacing */}
          <motion.div className="relative mt-20 pt-8" variants={itemVariants}>
            {/* Decorative line */}
            <motion.div
              className="absolute top-0 right-0 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            <div className="flex flex-col justify-center items-center gap-6">
              <motion.p
                className="text-sm text-gray-500 font-light"
                whileHover={{ color: "#374151" }}
              >
                © {new Date().getFullYear()} تیران. تمامی حقوق محفوظ است.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
        {/* Full-screen black section with centered logo - TiranStyle-like */}
        <Signature
          spinDuration={5} // Faster spin (5 seconds per rotation)
          isSpinning={true} // Enable spinning
          textColor="#000"
          logoWidth={20}
          logoHeight={20}
          className=""
        />{" "}
      </footer>
      {/* Backdrop Logo */}
      <div className="relative z-99 min-h-screen bg-gradient-to-tr from-blue-950  via-black  to-blue-950  overflow-hidden">
        {/* Main Content Container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          {/* Logo Container with Multiple Animation Layers */}
          <motion.div className="relative flex flex-col items-center justify-center">
            {/* Logo Image with Enhanced Effects */}
            <motion.div className=" z-10">
              <motion.div className="">
                <Image
                  src="/assets/images/whitelogo.png"
                  alt="Tiran Logo"
                  width={2000}
                  height={2000}
                  className="object-cover md:w-[500px] mx-auto transition-all duration-700"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Animated Text Below Logo */}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Footer;
