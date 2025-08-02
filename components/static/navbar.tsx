"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { navItems } from "../../lib/navbarData";

import {
  RiShoppingBag3Line,
  RiUser3Line,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightSLine,
  RiDashboardLine,
  RiLoginCircleLine,
} from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { Category, UserProfile } from "@/types/type";
import MegaMenu from "./megaMenu";

const Navbar = () => {
  const { totalItems } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [expandedCategory, setExpandedCategory] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [showCategoriesOnly, setShowCategoriesOnly] = useState(false);
  const prevScrollY = useRef(0);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setActiveItem(pathname);

    // Initialize GSAP animations
    gsap.set(".nav-item", { opacity: 0, y: -10 });
    gsap.to(".nav-item", { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 });
  }, [pathname]);

  const fetchCategories = async () => {
    const data = await fetch("/api/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.ok) {
      console.error("Failed to fetch categories data");
      return;
    }
    const categoriesData = await data.json();
    setCategories(categoriesData.data);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      const scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);

      if (window.scrollY > 10) {
        navbar?.classList.add("shadow-md");
      } else {
        navbar?.classList.remove("shadow-md");
      }

      // Update scroll progress
      if (scrollProgressRef.current) {
        gsap.set(scrollProgressRef.current, { scaleX: scrollProgress });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 150) {
        if (!showCategoriesOnly) {
          setShowCategoriesOnly(true);

          // Hide entire navbar except categories
          gsap.to("#navbar > div:first-child", {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });

          // Transform categories to fixed position
          gsap.to(categoriesRef.current, {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "8px 0",
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      } else {
        if (showCategoriesOnly) {
          setShowCategoriesOnly(false);

          // Show navbar
          gsap.to("#navbar > div:first-child", {
            height: "auto",
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          });

          // Reset categories position
          gsap.to(categoriesRef.current, {
            position: "relative",
            top: "auto",
            backgroundColor: "transparent",
            backdropFilter: "none",
            boxShadow: "none",
            padding: "8px 0",
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showCategoriesOnly]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        // Verify token by making a request to the user API
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && data.data) {
          setIsLoggedIn(true);
          setUserProfile(data.data);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (pathname === "/admin" || pathname === "/auth") {
    return null;
  }

  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 bg-[#fcf7f1]/50 hover:bg-[#fcf7f1] px-4 md:px-20 backdrop-blur-md transition-all duration-300 flex flex-col text-black`}
      dir="rtl"
    >
      <div className="max-w-screen">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-2">
          {/* Right side - Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <div key={item.name} className="nav-item relative px-1">
                <Link href={item.href}>
                  <span
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 hover:scale-105 ${
                      activeItem === item.href
                        ? "text-black font-bold"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                    onMouseEnter={(e) =>
                      gsap.to(e.target, { scale: 1.05, duration: 0.2 })
                    }
                    onMouseLeave={(e) =>
                      gsap.to(e.target, { scale: 1, duration: 0.2 })
                    }
                  >
                    {item.name}
                    {activeItem === item.href && (
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-lg" />
                    )}
                  </span>
                </Link>
              </div>
            ))}
          </div>
          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <div className="flex items-center justify-center transition-transform duration-200 hover:scale-110">
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={70}
                  height={70}
                  className="h-8 w-auto"
                />
              </div>
            </Link>
          </div>
          {/* Left side - Cart and Login */}
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Link href="/cart">
                <div
                  className="p-2 hidden md:block rounded-full hover:bg-gray-100 transition-colors duration-300"
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1.1,
                      rotation: 5,
                      duration: 0.2,
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      rotation: 0,
                      duration: 0.2,
                    })
                  }
                >
                  <RiShoppingBag3Line className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
              </Link>
            </div>

            <div>
              <Link href="/auth">
                <div
                  className="p-2 rounded-full hidden md:block hover:bg-gray-100 transition-colors duration-300"
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1.1,
                      rotation: -5,
                      duration: 0.2,
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      rotation: 0,
                      duration: 0.2,
                    })
                  }
                >
                  <RiUser3Line className="h-6 w-6" />
                </div>
              </Link>
            </div>
            <div className="relative group">
              {isLoggedIn ? (
                <>
                  <button className="hidden md:flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-200 hover:scale-105">
                    <span className="ml-1 text-sm font-medium">
                      {userProfile?.user.username}
                    </span>
                  </button>
                  <div className="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/dashboard">
                      <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-right transition-transform duration-200 hover:scale-105">
                        <RiDashboardLine className="ml-2" />
                        داشبورد کاربری
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <Link href="/auth">
                  <button className="hidden md:flex items-center text-gray-700 hover:text-gray-900 transition-transform duration-200 hover:scale-105">
                    <RiLoginCircleLine className="ml-1" />
                    <span className="text-sm font-medium">ورود / ثبت‌نام</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 -mx-12 rounded-md hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-110"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <RiCloseLine className="block h-6 w-6 transition-transform duration-200" />
                ) : (
                  <RiMenuLine className="block h-6 w-6 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Row - Desktop */}
      <div
        ref={categoriesRef}
        className="hidden md:block relative w-full transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            {categories.map((category, index: number) => (
              <div
                key={category.id}
                className="px-2 flex-shrink-0 relative group"
                onMouseEnter={() => {
                  setHoveredCategory(index);
                  gsap.to(`#category-${index}`, { scale: 1.05, duration: 0.2 });
                  gsap.to(`#underline-${index}`, {
                    width: "100%",
                    duration: 0.3,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredCategory(null);
                  gsap.to(`#category-${index}`, { scale: 1, duration: 0.2 });
                  gsap.to(`#underline-${index}`, { width: 0, duration: 0.3 });
                }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(
                    category.cat_name
                  )}`}
                >
                  <span
                    id={`category-${index}`}
                    className={`block px-4 py-2 text-sm font-medium relative transition-all duration-300 ${
                      hoveredCategory === index
                        ? " text-black"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    {category.cat_name}
                    <div
                      id={`underline-${index}`}
                      className="absolute bottom-0 right-0 h-0.5 bg-black"
                      style={{ width: 0 }}
                    />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {!showCategoriesOnly && (
          <MegaMenu
            categories={categories}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />
        )}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white/95 backdrop-blur-md shadow-lg min-h-[70vh]"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Categories section in mobile menu */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setExpandedCategory(!expandedCategory);
                  const arrow = document.getElementById("category-arrow");
                  gsap.to(arrow, {
                    rotation: expandedCategory ? 0 : 180,
                    duration: 0.3,
                  });

                  const categoryList = document.getElementById("category-list");
                  if (!expandedCategory) {
                    gsap.fromTo(
                      categoryList,
                      { height: 0, opacity: 0 },
                      { height: "auto", opacity: 1, duration: 0.3 }
                    );
                  } else {
                    gsap.to(categoryList, {
                      height: 0,
                      opacity: 0,
                      duration: 0.3,
                    });
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-black hover:bg-gray-50 transition-all duration-200 active:scale-95"
              >
                <span>دسته‌بندی‌ها</span>
                <div id="category-arrow">
                  <RiArrowRightSLine className="h-5 rotate-90 w-5" />
                </div>
              </button>

              <div
                id="category-list"
                className="overflow-hidden bg-gray-50/30 rounded-xl mt-2 mr-4 border-r-2 border-gray-200"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="py-2">
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/shop?category=${encodeURIComponent(
                            category.cat_name
                          )}`}
                          onClick={() => {
                            setIsOpen(false);
                            gsap.to(mobileMenuRef.current, {
                              height: 0,
                              opacity: 0,
                              duration: 0.3,
                            });
                          }}
                        >
                          <span
                            className="block px-4 py-2 text-sm font-medium text-black hover:text-black transition-all duration-200 hover:translate-x-1"
                            onTouchStart={(e) =>
                              gsap.to(e.target, { x: 5, duration: 0.1 })
                            }
                            onTouchEnd={(e) =>
                              gsap.to(e.target, { x: 0, duration: 0.1 })
                            }
                          >
                            {category.cat_name}
                          </span>
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => {
                              const newHovered =
                                hoveredCategory === index ? null : index;
                              setHoveredCategory(newHovered);

                              const subcategoryList = document.getElementById(
                                `subcategory-${index}`
                              );
                              const arrow = document.getElementById(
                                `subcategory-arrow-${index}`
                              );

                              if (newHovered === index) {
                                gsap.fromTo(
                                  subcategoryList,
                                  { height: 0, opacity: 0 },
                                  { height: "auto", opacity: 1, duration: 0.3 }
                                );
                                gsap.to(arrow, {
                                  rotation: 270,
                                  duration: 0.3,
                                });
                              } else {
                                gsap.to(subcategoryList, {
                                  height: 0,
                                  opacity: 0,
                                  duration: 0.3,
                                });
                                gsap.to(arrow, { rotation: 90, duration: 0.3 });
                              }
                            }}
                            className="px-4 py-2 active:scale-90 transition-transform duration-100"
                          >
                            <div id={`subcategory-arrow-${index}`}>
                              <RiArrowRightSLine className="h-4 text-black w-4" />
                            </div>
                          </button>
                        )}
                      </div>

                      {category.children && category.children.length > 0 && (
                        <div
                          id={`subcategory-${index}`}
                          className="overflow-hidden bg-gray-50/20 mr-6 border-r border-gray-200"
                          style={{ height: 0, opacity: 0 }}
                        >
                          {category.children.map((subcategory) => (
                            <div key={subcategory.id}>
                              <Link href={`/category/${subcategory.slug}`}>
                                <span
                                  className="block px-4 py-1.5 text-xs font-medium text-gray-800 hover:text-black transition-all duration-200 hover:translate-x-1"
                                  onTouchStart={(e) =>
                                    gsap.to(e.target, { x: 5, duration: 0.1 })
                                  }
                                  onTouchEnd={(e) =>
                                    gsap.to(e.target, { x: 0, duration: 0.1 })
                                  }
                                >
                                  {subcategory.cat_name}
                                </span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regular nav items in mobile menu */}
            {navItems.map((item, index) => (
              <div key={item.name} className="block">
                <Link href={item.href}>
                  <div
                    onClick={() => {
                      setIsOpen(false);
                      gsap.to(mobileMenuRef.current, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                      });
                    }}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 active:scale-95 hover:translate-x-1 ${
                      activeItem === item.href
                        ? "text-black font-bold bg-gray-50"
                        : "text-black hover:bg-gray-50"
                    }`}
                    onTouchStart={(e) =>
                      gsap.to(e.currentTarget, {
                        x: 5,
                        backgroundColor: "rgba(0,0,0,0.05)",
                        duration: 0.1,
                      })
                    }
                    onTouchEnd={(e) =>
                      gsap.to(e.currentTarget, {
                        x: 0,
                        backgroundColor: "transparent",
                        duration: 0.1,
                      })
                    }
                  >
                    {item.name}
                  </div>
                </Link>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 gap-4">
              <Link
                href="/auth"
                onClick={() => {
                  setIsOpen(false);
                  gsap.to(mobileMenuRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                  });
                }}
              >
                <div className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-black bg-gray-50 hover:bg-gray-100 transition-all duration-200 active:scale-95">
                  <RiUser3Line className="ml-2 h-5 w-5" />
                  <span className="text-sm">ورود</span>
                </div>
              </Link>

              <Link
                href="/cart"
                onClick={() => {
                  setIsOpen(false);
                  gsap.to(mobileMenuRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                  });
                }}
              >
                <div className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-black bg-gray-50 hover:bg-gray-100 transition-all duration-200 active:scale-95">
                  <RiShoppingBag3Line className="ml-2 h-5 w-5" />
                  <span className="text-sm">سبد خرید</span>
                  <span className="mr-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
