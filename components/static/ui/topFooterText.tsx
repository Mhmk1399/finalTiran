"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { AriaBold } from "@/next-persian-fonts/woff2";

const TopFooterText: React.FC = () => {
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<HTMLDivElement>(null);

  const lineHeight = 28; // px — match Tailwind's leading-7 (1.75rem)

  const seoContent = `  استایل جور دیگر، برای خانواده اصیل ایرانی

تیران استایل، فقط یک برند نیست؛ یک نگاه تازه است به سبک زندگی اشرافی ایرانی که گذشته را می‌فهمد و آینده را طراحی می‌کند.
ما در تیران استایل، با الهام از هویت، هنر و وقار ایرانی، محصولاتی را طراحی و تولید می‌کنیم که نه فقط زیبا هستند، بلکه معنا دارند؛ محصولاتی برای کسانی که به اصالت، ظرافت و خاص‌بودن باور دارند.

 از تار فرش تا تار زندگی
ترکیب خیره‌کننده‌ی فرش ابریشم ایرانی با چرم‌هایی مثل چرم طبیعی گاوی و چرم ماهی خاویار، امضای ما در دکوراسیون اشرافی ایرانی‌ست.
ما این اصالت را از خانه آغاز کردیم؛ و تا دل سبک زندگی گسترش دادیم.

 در قلب آشپزخانه، هنر جریان دارد
طراحی و ساخت چاقوهای آشپزخانه‌ی دست‌ساز ایرانی با تیغه‌های حرفه‌ای و دسته‌های چوبی یا چرمی، بخشی از رویکرد ما به زیبایی در زندگی روزمره است.
هر چاقو و لوازم آشپزخانه، ترکیبی‌ست از فرم، کارایی و روح هنر ایرانی.

 دیوارهایی که حرف می‌زنند
در تیران استایل، ما تابلوهای نقاشی، خطاطی و خوشنویسی را نه‌فقط به‌عنوان تزئین، که به‌عنوان زبان روح خانه می‌شناسیم.
تابلوهای ما، انتخابی برای کسانی‌ست که زندگی‌شان با شعر، رنگ و معنا گره خورده.

 حرکت با وقار؛ از دوچرخه برقی تا اسکوتر معلولین
ما به حمل‌ونقل شهری به چشم یک تجربه شخصی نگاه می‌کنیم.
از دوچرخه‌های برقی خاص با طراحی منحصر‌به‌فرد گرفته تا اسکوترهای برقی ویژه‌ی افراد کم‌توان یا سالمند، تیران استایل در حال بازتعریف “حرکت” در دنیای امروز است.
نه فقط با تکنولوژی، که با شأن و زیبایی.

 دنیای پیپ، دنیای تأمل و فلسفه
در دنیای پرشتاب امروز، فلسفه‌ی پیپ یعنی مکث، تأمل، و انتخابی متفاوت.
ما مجموعه‌ای از پیپ‌ها، اکسسوری‌های پیپ، جعبه‌ها و وسایل جانبی را برای افرادی طراحی کرده‌ایم که به خلوت، فکر و جزئیات زندگی‌شان ارزش می‌گذارند.

تیران استایل؛ انتخاب کسانی‌ست که ساده نمی‌گذرند

ما برای خانواده‌ی اصیل ایرانی طراحی می‌کنیم که ریشه دارند، برای افرادی که از اصالت نمی‌گذرند، و برای خانواده‌هایی که “سبک زندگی” را زندگی می‌کنند.
چه با یک تابلو خط، چه با یک دوچرخه برقی خاص، یا حتی با چاقوی آشپزخانه‌تان، تیران استایل بخشی از روایت شماست.

 تیران استایل، زندگی جور دیگر...`;

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
    <div className="w-full max-w-full mx-auto px-4 md:pl-20 md:pr-28 py-8" dir="rtl">
      <div className="bg-white relative text-black overflow-hidden">
        {/* عنوان */}
        <span className="text-2xl font-bold mb-4 ml-2">■</span>
        <h2 className={`text-xl ${AriaBold.className} inline mb-4`}>تیران استایل </h2>

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
                className="absolute bottom-0 left-0  right-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent"
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
              className="flex mt-2 items-center gap-1 px-7 cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition"
            >
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-3 h-3" />
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
