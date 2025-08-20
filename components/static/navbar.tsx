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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const prevScrollY = useRef(0);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  console.log(isLoading)

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

  // Optimized single scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const newIsScrolled = currentScrollY > 10;
          const newShowCategoriesOnly = currentScrollY > 150;
          const newIsAtBottom =
            window.innerHeight + currentScrollY >=
            document.body.offsetHeight - 100;

          // Update scroll state
          if (newIsScrolled !== isScrolled) {
            setIsScrolled(newIsScrolled);
          }

          // Handle categories-only mode
          if (newShowCategoriesOnly !== showCategoriesOnly) {
            setShowCategoriesOnly(newShowCategoriesOnly);
          }

          // Handle bottom detection
          if (newIsAtBottom !== isAtBottom) {
            setIsAtBottom(newIsAtBottom);
          }

          prevScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled, showCategoriesOnly, isAtBottom]);

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
        <div className="w-4 h-4 border-2 border-transparent   rounded-full animate-spin"></div>
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
      className={`fixed w-full z-50 transition-all hover:bg-[#fcf7f1] duration-300 flex flex-col text-black ${
        isScrolled || showCategoriesOnly
          ? "bg-[#fcf7f1]/95 backdrop-blur-md "
          : "bg-[#fcf7f1]/50 backdrop-blur-md"
      } ${showCategoriesOnly ? "md:bg-transparent" : ""}`}
      dir="rtl"
    >
      <div
        className={`max-w-screen transition-all duration-300 px-4 md:px-20 ${
          showCategoriesOnly
            ? "md:opacity-0 md:h-0 md:overflow-hidden"
            : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-20 px-2 sm:px-4 lg:px-2">
          {/* Right side - Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <div key={item.name} className="nav-item relative px-1">
                <Link href={item.href}>
                  <span
                    className={`block px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 ${
                      activeItem === item.href
                        ? "text-black font-bold"
                        : "text-gray-700 hover:text-black "
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
              <div className="flex items-center justify-center transition-transform duration-200 ">
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={200}
                  height={60}
                  className="md:h-10 w-70 md:mb-4 -mt-1   transition-all duration-300 group-hover:brightness-110"
                />
              </div>
            </Link>
          </div>
          {/* Left side - Cart and Login */}
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Link href="/cart">
                <div className="p-2 hidden md:block rounded-full hover:bg-gray-100 transition-colors duration-300">
                  <RiShoppingBag3Line className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
              </Link>
            </div>

            <div className="relative group">
              {isLoggedIn ? (
                <>
                  <button className="hidden md:flex md:items-center md:gap-2 px-3 py-2 rounded-lg  text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-105  ">
                    <RiUser3Line className="h-5 w-5" />
                    <span className="text-sm font-medium truncate max-w-24">
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
                  <button className="hidden md:flex items-center cursor-pointer text-gray-700 hover:text-gray-900 transition-transform duration-200 ">
                    <RiUser3Line className="h-5 w-5 ml-1" />
                    <span className="text-sm font-medium">ورود / ثبت‌نام</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden absolute top-3 right-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/20 focus:outline-none transition-all duration-200 active:scale-95"
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
        className={`hidden md:block w-full transition-all duration-300 ${
          showCategoriesOnly
            ? "fixed top-0 left-0 right-0 z-60 bg-[#fcf7f1]/95 backdrop-blur-xl shadow-lg px-4 md:px-20"
            : "relative"
        }`}
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
                  href={`/shop?query=${encodeURIComponent(
                    category.cat_en_name
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
                      className="absolute bottom-0 right-0 h-[1px] bg-black"
                      style={{ width: 0 }}
                    />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <MegaMenu
          categories={categories}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        />
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-16 left-0 right-0 bg-[#fcf7f1]/98 backdrop-blur-xl shadow-2xl min-h-[calc(100vh-4rem)] z-40 border-t border-white/20"
        >
          <div className="px-4 pt-6 pb-8 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-base font-medium text-black hover:bg-white/30 transition-all duration-200 active:scale-95 backdrop-blur-sm"
              >
                <span>دسته‌بندی‌ها</span>
                <div id="category-arrow">
                  <RiArrowRightSLine className="h-5 rotate-90 w-5" />
                </div>
              </button>

              <div
                id="category-list"
                className="overflow-hidden bg-white/20 backdrop-blur-sm rounded-2xl mt-3 mr-4 border-r-2 border-white/30"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="py-2">
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/shop?query=${encodeURIComponent(
                            category.cat_en_name
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
                              <RiArrowRightSLine className="h-4 rotate-360 text-black w-4" />
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
                          {category.children.map((subcategory, subIndex) => (
                            <div key={subcategory.id}>
                              <div className="flex items-center justify-between">
                                <span
                                  className="block px-4 py-1.5 text-xs font-medium text-gray-800 cursor-default"
                                >
                                  {subcategory.cat_name}
                                </span>
                                {subcategory.children && subcategory.children.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const thirdLevelList = document.getElementById(
                                        `thirdlevel-${index}-${subIndex}`
                                      );
                                      const arrow = document.getElementById(
                                        `thirdlevel-arrow-${index}-${subIndex}`
                                      );
                                      
                                      const isExpanded = thirdLevelList?.style.height !== '0px';
                                      
                                      if (!isExpanded) {
                                        gsap.fromTo(
                                          thirdLevelList,
                                          { height: 0, opacity: 0 },
                                          { height: "auto", opacity: 1, duration: 0.3 }
                                        );
                                        gsap.to(arrow, { rotation: 270, duration: 0.3 });
                                      } else {
                                        gsap.to(thirdLevelList, {
                                          height: 0,
                                          opacity: 0,
                                          duration: 0.3,
                                        });
                                        gsap.to(arrow, { rotation: 90, duration: 0.3 });
                                      }
                                    }}
                                    className="px-2 py-1 active:scale-90 transition-transform duration-100"
                                  >
                                    <div id={`thirdlevel-arrow-${index}-${subIndex}`}>
                                      <RiArrowRightSLine className="h-3 rotate-90 text-gray-600 w-3" />
                                    </div>
                                  </button>
                                )}
                              </div>
                              
                              {subcategory.children && subcategory.children.length > 0 && (
                                <div
                                  id={`thirdlevel-${index}-${subIndex}`}
                                  className="overflow-hidden bg-gray-100/20 mr-4 border-r border-gray-300"
                                  style={{ height: 0, opacity: 0 }}
                                >
                                  {subcategory.children.map((thirdLevel) => (
                                    <div key={thirdLevel.id}>
                                      <Link
                                        onClick={() => setIsOpen(!isOpen)}
                                        href={`/shop?query=${thirdLevel.cat_en_name}`}
                                      >
                                        <span
                                          className="block px-4 py-1 text-xs font-medium text-gray-700 hover:text-black transition-all duration-200 hover:translate-x-1"
                                          onTouchStart={(e) =>
                                            gsap.to(e.target, { x: 5, duration: 0.1 })
                                          }
                                          onTouchEnd={(e) =>
                                            gsap.to(e.target, { x: 0, duration: 0.1 })
                                          }
                                        >
                                          {thirdLevel.cat_name}
                                        </span>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}
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
            {navItems.map((item) => (
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
                    className={`block px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200 active:scale-95 hover:translate-x-1 ${
                      activeItem === item.href
                        ? "text-black font-bold bg-white/40 backdrop-blur-sm"
                        : "text-black hover:bg-white/30 backdrop-blur-sm"
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

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/30 gap-4">
              <Link
                href={isLoggedIn ? "/dashboard" : "/auth"}
                className="flex md:hidden items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-105"
                onClick={() => {
                  setIsOpen(false);
                  gsap.to(mobileMenuRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                  });
                }}
              >
                <RiUser3Line className="h-5 w-5" />
                <span className="text-sm font-medium truncate max-w-24">
                  {isLoggedIn ? userProfile?.user.username : "ورود / ثبت نام"}
                </span>
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
                <div className="flex items-center px-4 py-4 rounded-2xl text-base font-medium text-black bg-white/40 hover:bg-white/50 backdrop-blur-sm transition-all duration-200 active:scale-95">
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
