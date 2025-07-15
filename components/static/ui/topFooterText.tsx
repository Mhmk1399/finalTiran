"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const TopFooterText: React.FC = () => {
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<HTMLDivElement>(null);

  const lineHeight = 28; // px — match Tailwind's leading-7 (1.75rem)

  const seoContent = `فروشگاه آنلاین تیران، برترین مرکز خرید پوشاک و مد در ایران است. ما مجموعه‌ای کامل از جدیدترین مدل‌های لباس زنانه، مردانه و بچگانه را با بهترین کیفیت و قیمت‌های مناسب ارائه می‌دهیم. محصولات ما شامل انواع پیراهن، شلوار، کت و شلوار، لباس مجلسی، لباس راحتی، کفش، کیف و اکسسوری می‌باشد.

تمامی کالاهای موجود در فروشگاه تیران از برندهای معتبر داخلی و خارجی تهیه شده و دارای گارانتی اصالت هستند. ما با بیش از 10 سال تجربه در زمینه فروش پوشاک، اعتماد هزاران مشتری را جلب کرده‌ایم و متعهد هستیم بهترین تجربه خرید آنلاین را برای شما فراهم کنیم.

خدمات ویژه فروشگاه تیران شامل ارسال رایگان برای خریدهای بالای 500 هزار تومان، امکان مرجوعی کالا تا 7 روز پس از خرید، پشتیبانی 24 ساعته، تضمین کیفیت و اصالت کالا، و پرداخت امن آنلاین و درب منزل می‌باشد. چشم‌انداز ما تبدیل شدن به بزرگترین فروشگاه آنلاین پوشاک در خاورمیانه است.`;

  useEffect(() => {
    if (fullTextRef.current) {
      const fullHeight = fullTextRef.current.scrollHeight;
      const maxCollapsedHeight = lineHeight * 2;

      setContentHeight(isExpanded ? fullHeight : maxCollapsedHeight);
      setShowToggle(fullHeight > maxCollapsedHeight);
    }
  }, [isExpanded]);

  if (pathname === "/admin" || pathname === "/auth" || pathname === "/about") {
    return null;
  }

  return (
    <div className="w-full max-w-full mx-auto px-4 md:px-20 py-8" dir="rtl">
      <div className="bg-white relative text-black overflow-hidden">
        {/* عنوان */}
        <span className="text-2xl font-bold mb-4 ml-2">■</span>
        <h2 className="text-xl font-bold inline mb-4">تیران استایل </h2>

        {/* متن کامل پنهان برای اندازه‌گیری ارتفاع */}
        <div
          ref={fullTextRef}
          className="absolute invisible pointer-events-none w-full whitespace-pre-wrap leading-7 text-base"
        >
          {seoContent}
        </div>

        {/* جعبه متنی با انیمیشن */}
        <motion.div
          ref={containerRef}
          className="relative overflow-hidden"
          animate={{ height: contentHeight }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="whitespace-pre-wrap px-7 mt-2 text-justify leading-7 text-base text-gray-800">
            {seoContent}
          </div>

          {/* لایه نیمه‌شفاف برای حالت collapse */}
          <AnimatePresence>
            {!isExpanded && showToggle && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* دکمه باز/بستن */}
        {showToggle && (
          <div className="flex justify-start mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-7  text-sm font-medium text-gray-700 hover:text-black transition"
            >
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-4 h-4" />
              </motion.span>
              {isExpanded ? "نمایش کمتر" : "مشاهده بیشتر"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFooterText;
