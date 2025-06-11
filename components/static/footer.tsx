"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import Signature from "../global/signature";
import { Category } from "@/types/type";
import { contactInfo, MainLink, socialLinks } from "@/lib/footerData";

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
      type: "spring",
      stiffness: 100,
    },
  },
};

// Add this function to fetch categories (adjust the API endpoint as needed)

const Footer = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const footerEndRef = useRef(null);

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

        // Filter categories that have children
        const categoriesWithChildren = categoriesArray.filter(
          (category: Category) =>
            category.children && category.children.length > 0
        );

        setCategories(categoriesWithChildren);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const { scrollYProgress } = useScroll({
    target: footerEndRef,
    offset: ["start end", "end end"],
  });

  // Transform values for parallax effects
  const logoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  if (pathname === "/admin" || pathname === "/auth") {
    return null;
  }

  return (
    <footer dir="rtl" className="bg-white text-white relative">
      {/* Wave SVG Divider */}
      <motion.div
        className="container mx-auto px-8 pt-20 pb-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Brand Section - Takes more space */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block"
            >
              <Link href="/" className="flex items-center group">
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={160}
                  height={60}
                  className="h-10 w-auto transition-all duration-300 group-hover:brightness-110"
                />
              </Link>
            </motion.div>

            <div className="max-w-md">
              <p className="text-gray-600 text-base leading-relaxed font-light">
                ارائه راهکارهای نوین فناوری برای کسب و کارها با هدف رشد و نوآوری
                در دنیای دیجیتال
              </p>
            </div>

            {/* Social Links with better spacing */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">
                دنبال کنید:
              </span>
              <div className="flex gap-3">
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
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-900 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.name}
                    >
                      <IconComponent
                        size={16}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <div className="relative">
              <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                خدمات
                <motion.div
                  className="absolute -bottom-2 right-0 h-0.5 bg-black rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </h3>
            </div>

            <nav className="space-y-4">
              {MainLink.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                <motion.div
                  className="absolute -bottom-2 right-0 h-0.5 bg-black rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
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
                {categories.slice(0, 4).map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(
                        category.cat_name
                      )}`}
                      className="group flex items-center justify-between text-gray-600 hover:text-gray-900 transition-all duration-300 text-sm"
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
                      {category.children && category.children.length > 0 && (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                          {category.children.length}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {categories.length > 4 && (
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                )}
              </nav>
            ) : (
              <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg text-center">
                دسته‌بندی‌ای یافت نشد
              </p>
            )}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 space-y-6"
          >
            <div className="relative">
              <h3 className="text-lg text-gray-900 font-semibold mb-6 relative">
                تماس با ما
                <motion.div
                  className="absolute -bottom-2 right-0 h-0.5 bg-black rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </h3>
            </div>

            <div className="space-y-5">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br text-black from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                        <IconComponent />
                      </div>
                      <div className="flex-1 min-w-0">
                        {contact.isLink && contact.href ? (
                          <Link
                            href={contact.href}
                            target="_blank"
                            className="block text-gray-700 hover:text-gray-900 text-sm leading-relaxed transition-colors duration-300 group-hover:font-medium"
                            title={contact.label}
                          >
                            {contact.value}
                          </Link>
                        ) : (
                          <span className="block text-gray-700 text-sm leading-relaxed">
                            {contact.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
      <div
        ref={footerEndRef}
        className="relative h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
      >
        {/* Floating Particles */}
        {/* {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            transition={{
              delay: i * 0.1,
              duration: 2,
              ease: "easeOut",
            }}
          />
        ))} */}

        {/* Main Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Logo Container with Multiple Animation Layers */}
          <motion.div
            className="relative flex flex-col items-center"
            style={{
              scale: logoScale,
              opacity: logoOpacity,
            }}
          >
            {/* Logo Image with Enhanced Effects */}
            <motion.div className="relative z-10 mt-30">
              <motion.div
                className="relative"
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <Image
                  src="/assets/images/whitelogo.png"
                  alt="Tiran Logo"
                  width={4000}
                  height={4000}
                  className="md:h-20 h-10 w-auto object-cover transition-all duration-700"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Animated Text Below Logo */}
            <motion.div className="mt-8 text-center">
              <motion.h2
                className="text-white text-xl md:text-2xl font-light tracking-wider mb-2"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                تیران
              </motion.h2>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Signature
        spinDuration={5} // Faster spin (5 seconds per rotation)
        isSpinning={true} // Enable spinning
        textColor="#0f172a"
        logoWidth={20}
        logoHeight={20}
      />{" "}
    </footer>
  );
};

export default Footer;
