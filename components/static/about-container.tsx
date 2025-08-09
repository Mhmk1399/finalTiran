"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { motion } from "framer-motion";
import { maneli } from "@/next-persian-fonts/maneli";

const teamMembers = [
  {
    id: 1,
    name: "علی احمدی",
    position: "مدیر عامل",
    image: "/assets/images/team.png",
    alt: "علی احمدی - مدیر عامل",
  },
  {
    id: 2,
    name: "سارا محمدی",
    position: "مدیر فروش",
    image: "/assets/images/team1.png",
    alt: "سارا محمدی - مدیر فروش",
  },
  {
    id: 3,
    name: "حسین رضایی",
    position: "مدیر طراحی",
    image: "/assets/images/team2.png",
    alt: "حسین رضایی - مدیر طراحی",
  },
  {
    id: 4,
    name: "فاطمه کریمی",
    position: "مدیر بازاریابی",
    image: "/assets/images/team3.png",
    alt: "فاطمه کریمی - مدیر بازاریابی",
  },
];

export default function AboutContainer() {
  useEffect(() => {
    const container = document.getElementById("horizontal-scroll-container");
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scroll on large screens
      if (window.innerWidth >= 1024) {
        container.scrollLeft -= e.deltaY;
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);
  return (
    <main className="h-screen lg:overflow-y-hidden lg:overflow-x-hidden">
      <div
        id="horizontal-scroll-container"
        className="
            flex flex-col 
    lg:flex-row-reverse
    lg:overflow-x-scroll
    lg:overflow-y-hidden
    overflow-y-auto
    overflow-x-hidden
    scroll-smooth
    w-full
    h-full
    [&::-webkit-scrollbar]:hidden
    lg:[&::-webkit-scrollbar]:hidden
        "
      >
        {/* Hero Section */}
        <section className="  lg:pt-20 flex flex-col lg:flex-row flex-shrink-0 w-screen h-screen snap-start">
          {/* Text Content - Mobile: Top, Desktop: Left Side */}
          <div
            className={`w-full ${AriaBold.className}  lg:w-3/5 flex flex-col justify-center lg:justify-end items-center lg:items-end px-4 sm:px-6 lg:px-8 xl:px-16 bg-white order-2 lg:order-1 py-8 lg:py-0`}
          >
            <div className="max-w-2xl text-center lg:text-right">
              <h1 className="text-[28px]  md:text-[40px] lg:text-5xl text-gray-900 mb-6 leading-normal">
                برای نسلی که <br className="hidden sm:block" />
                <br className="block md:hidden" />
                <span className="relative inline-block">
                  <span className="relative z-10 text-white px-2 sm:px-3 lg:px-4 bg-green-800 shadow-lg transform hover:scale-105 transition-all duration-300 text-[28px] md:text-[40px] lg:text-3xl xl:text-5xl">
                    ایـــــــــران
                  </span>
                  {/* Decorative elements */}
                </span>
                <br className="block lg:hidden" />
                را
                <br className="hidden lg:block" />
                <span className="hidden lg:inline"> ... </span> سبز می‌بیند
              </h1>
            </div>
          </div>

          {/* Image - Mobile: Top, Desktop: Right Side */}
          <div className="w-full lg:w-2/5 relative h-100  md:h-96  lg:h-auto order-1 lg:order-2">
            <Image
              src="/assets/images/aboutHero.png"
              alt="تیم تیران"
              fill
              className="object-cover "
              priority
              dir="ltr"
            />
          </div>
        </section>

        {/* New Section - Image Left, Text Right */}
        <section className="min-h-screen flex-shrink-0 w-screen lg:w-[120vw] h-screen snap-start mt-35 md:mt-40 lg:mt-20 flex flex-col-reverse lg:flex-row justify-center ">
          {/* Image - Left Side */}
          <div className="w-full lg:w-4/6 relative h-full md:h-96 lg:h-auto ">
            <Image
              src="/assets/images/aboutsec2.png" // You can change this to your desired image
              alt="Tiran Style"
              width={2000}
              height={1200}
              className="object-cover"
            />
          </div>

          {/* Text Content - Right Side */}
          <div
            className="w-full lg:w-2/6 md:text-right -mt-40 sm:-mt-0 flex flex-col justify-start items-start px-4 sm:px-6 lg:px-8  bg-white order-2 md:py-8 lg:py-0"
            dir="rtl"
          >
            <div className=" border-t lg:border-t-0 lg:border-r border-dashed border-gray-400 pt-5 lg:pr-15 lg:pl-10 mt-12">
              {/* Text Box */}
              <div className="">
                <h2 className="mt-4">
                  <span
                    className={`text-[24px] ${AriaBold.className}   md:text-2xl lg:text-3xl  text-gray-900`}
                  >
                    درباره ما
                  </span>
                </h2>
                <p className="text-[16px] mt-4 md:text-base text-gray-700 text-justify leading-relaxed ">
                  اصالت، چیزی نیست که ساخته شود؛ به ارث می‌رسد. و ما در تیران
                  استایل این میراث را، نه در موزه، بلکه در زندگی روزمره زنده نگه
                  می‌داریم. ما در تیران استایل به دنبال زیبایی سطحی نیستیم. آنچه
                  برای ما مهم است، آن عمق پنهانی‌ست که پشت هر طراحی خوابیده جایی
                  بین وقار سنت و جسارت معاصر. در دنیایی که سرعت، سادگی و تکرار
                  همه‌چیز را بلعیده، ما تلاش می‌کنیم تا طراحی، دوباره معنا پیدا
                  کند. تا آن‌چه روی دوش نسل امروز می‌نشیند، یادآور اصالت نسل‌های
                  پیشین باشد. برای ما، این مسیر فقط یک مسیر کاری نیست. تعهدی
                  شخصی‌ست برای نگه‌داشتن ریشه‌ها در دل طراحی معاصر. باور داریم
                  که اگر امروز نتونیم گذشته‌مون رو به زبان امروز روایت کنیم،
                  فردا چیزی برای افتخار نخواهیم داشت.
                </p>
              </div>
              {/* TIRAN STYLE Heading */}
              {/* <Image
                src={"/assets/images/TIRAN.png"}
                alt="TIRAN STYLE"
                width={300}
                height={200}
                className="lg:mt-20 mt-20 pb-20"
              /> */}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section
          className=" flex-shrink-0 min-h-full py-16 md:pt-85 lg:py-24"
          dir="rtl"
        >
          <div className="flex flex-col lg:flex-row justify-center  lg:justify-start lg:items-center gap-16 w-screen lg:w-[2680px] mx-auto px-4 lg:px-8">
            {/* Title and Description */}
            <div className="lg:w-[520px] w-full h-full mt-10 lg:mt-0 md:mt-0 text-center flex flex-col gap-28 lg:gap-60 flex-shrink-0">
              <h2
                className={`md:text-[24px] text-lg  ${AriaBold.className}   text-gray-900 `}
              >
                اعضای تیم ما
              </h2>
              <p className="text-xs md:text-[20px] text-gray-600 leading-relaxed -mt-10 ">
                تیران استایل، با تکیه بر شعار الهام‌بخش استایل جور دیگر…، برندی
                پیشرو در فشن، تکنولوژی و لایف‌استایل است که برای افراد خاص و
                جسور طراحی شده است. ما با تمرکز بر ارائه محصولات منحصربه‌فرد،
                سلیقه مشتریانمان را به بالاترین سطح ارتقا می‌دهیم.
              </p>
            </div>

            {/* Team Images Row */}
            <div className="flex flex-col lg:flex-row md:gap-5 gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-start group"
                >
                  <div className="w-full relative h-full mt-8">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      width={4000}
                      height={4000}
                      className=" object-cover h-120"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0  transition-opacity duration-300"></div>
                  </div>
                  <h3 className={` ${AriaBold.className}  text-xl mt-4 mb-2`}>
                    {member.name}
                  </h3>
                  <p className="text-sm opacity-80 text-gray-400 text-right">
                    {member.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Section - Text Left (Black BG), Image Right */}
        <section className="min-h-screen flex-shrink-0 w-screen snap-start lg:pt-20 flex flex-col-reverse lg:flex-row">
          {/* Text Content with Black Background - Left Side */}
          <div className="w-full lg:w-1/2 bg-slate-950/95 flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8  order-2 lg:order-1 py-16 lg:py-0">
            <div className="w-full">
              {/* Description Text */}
              <div className="space-y-3 mr-4">
                {" "}
                {/* Company Image */}
                <motion.div
                  className={`flex justify-center text-gray-50 lg:justify-end ${maneli.className}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                ...  استایل جور دیگر 
                </motion.div>
                {/* Address */}
                <div className=" text-gray-50 text-xl md:text-2xl text-right font-bold">
                :  آدرس 
                </div>
                {/* Description Text */}
                <div className="space-y-3 mr-4">
                  {" "}
                  <motion.p
                    className="text-gray-400 text-right text-[14px] md:text-[16px] lg:text-sm xl:text-base leading-relaxed  lg:text-right "
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    دفتر مرکزی : تهران، اختیاریه، خیابان بهار جنوبی کوچه سعید{" "}
                  </motion.p>
                  <motion.p
                    className="text-gray-400 text-right text-[14px] md:text-[16px] lg:text-sm xl:text-base leading-relaxed  lg:text-right "
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    استودیو طراحی : کرمان، کارخانه نوآوری{" "}
                  </motion.p>
                  <motion.p
                    className="text-gray-400 text-right text-[14px] md:text-[16px] lg:text-sm xl:text-base leading-relaxed  lg:text-right "
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                   QT استودیو محتوا : خیابان فلسطین، تقاطع زرگمهر، استودیو 
                  </motion.p>
                </div>
                {/* Contact Info */}
                <motion.div
                  className="space-y-1 text-right mt-5 flex flex-col justify-end md:mt-8 mb-8 "
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Phone */}

                  <div className="flex flex-row-reverse items-center justify-end lg:justify-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-7 lg:h-7 xl:w-8 xl:h-8  text-gray-400 flex-shrink-0">
                      تلفن
                    </div>
                    <Link
                      href="tel:02191097613"
                      className="text-gray-100 font-bold text-sm sm:text-base lg:text-xs xl:text-sm text-center lg:text-right"
                    >
                      ۹۱۰۹۷۶۱۳ - ۰۲۱
                    </Link>
                  </div>

                  <div className="flex flex-row-reverse items-center justify-end lg:justify-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-7 lg:h-7 xl:w-8 xl:h-8  text-gray-400 flex-shrink-0">
                      ایمیل
                    </div>
                    <Link
                      href="mailto:info@tiranstyle.com"
                      className="text-gray-100 font-bold text-sm sm:text-base lg:text-xs xl:text-sm text-center lg:text-right"
                    >
                      info@tiranstyle.com
                    </Link>
                  </div>
                  <div className="flex flex-row-reverse items-center justify-end lg:justify-start gap-3">
                    <div className="flex items-center text-gray-400 justify-center text-nowrap ">
                      ساعات کاری 
                    </div>
                    <span className="text-gray-100 font-bold text-sm sm:text-base lg:text-xs xl:text-sm text-center lg:text-right">
                      از ساعت ۱۰:۰۰ تا ساعت ۱۸:۰۰
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Image - Right Side */}
          <div className="w-full lg:w-1/2 relative h-[50vh] sm:h-80 md:h-96 lg:h-auto order-1 lg:order-2">
            <Image
              src="/assets/images/tirancontact.png" // You can change this to your desired image
              alt="تماس با تیران"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Optional overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </section>
      </div>
    </main>
  );
}
