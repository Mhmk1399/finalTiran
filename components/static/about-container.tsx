"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AriaBold } from "@/next-persian-fonts/woff2";

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
      container.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      // موقع خروج از صفحه پاکش کن تا روی صفحات دیگه اثر نذاره
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);
  return (
    <main className="scroll-x-hidden">
      <div
        id="horizontal-scroll-container"
        className="flex flex-row-reverse overflow-x-scroll overflow-y-hidden h-screen w-screen scroll-smooth "
      >
        {/* Hero Section */}
        <section className="min-h-screen ml-6 pt-20 flex flex-col lg:flex-row flex-shrink-0 w-screen h-screen snap-start">
          {/* Text Content - Mobile: Top, Desktop: Left Side */}
          <div
            className={`w-full ${AriaBold.className}  lg:w-3/5 flex flex-col justify-center lg:justify-end items-center lg:items-end px-4 sm:px-6 lg:px-8 xl:px-16 bg-white order-2 lg:order-1 py-8 lg:py-0`}
          >
            <div className="max-w-2xl text-center lg:text-right">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl   text-gray-900 mb-6 leading-tight">
                برای نسلی که <br className="hidden sm:block" />
                <span className="relative inline-block">
                  <span className="relative z-10 text-white px-2 sm:px-3 lg:px-4 bg-green-800 shadow-lg transform hover:scale-105 transition-all duration-300 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl">
                    ایـــــــــران
                  </span>
                  {/* Decorative elements */}
                </span>{" "}
                را <br className="hidden md:block" />
                <span className="hidden lg:inline"> ... </span> سبز می‌بیند
              </h1>
            </div>
          </div>

          {/* Image - Mobile: Top, Desktop: Right Side */}
          <div className="w-full lg:w-2/5 relative h-110  md:h-96 lg:h-auto order-1 lg:order-2">
            <Image
              src="/assets/images/fashion/2.avif"
              alt="تیم تیران"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </section>
        {/* New Section - Image Left, Text Right */}
        <section className="min-h-screen flex-shrink-0 w-screen h-screen snap-start mt-30 flex flex-col md:flex-row justify-center md:mt-20">
          {/* Image - Left Side */}
          <div className="w-full lg:w-3/5 relative h-64 md:h-96 lg:h-auto pt-80 lg:mt-4">
            <Image
              src="/assets/images/fashion/3.avif" // You can change this to your desired image
              alt="Tiran Style"
              fill
              className="object-cover -mt-4"
            />
          </div>

          {/* Text Content - Right Side */}
          <div
            className="w-full lg:w-2/5 text-center md:text-right flex flex-col justify-start items-start px-4 sm:px-6 lg:px-8  bg-white order-2 md:py-8 lg:py-0"
            dir="rtl"
          >
            <div className="max-w-xl">
              {/* Text Box */}
              <div className="">
                <h2 className="mt-4">
                  <span className={`text-xl ${AriaBold.className}   md:text-2xl lg:text-3xl  text-gray-900`}>
                    درباره ما
                  </span>
                </h2>
                <p className="text-xs  md:text-base text-gray-700 leading-relaxed md:mb-6">
                  تیران استایل، با تکیه بر شعار الهام‌بخش استایل جور دیگر…،
                  برندی پیشرو در فشن، تکنولوژی و لایف‌استایل است که برای افراد
                  خاص و جسور طراحی شده است. ما با تمرکز بر ارائه محصولات
                  منحصربه‌فرد، سلیقه مشتریانمان را به بالاترین سطح ارتقا
                  می‌دهیم.
                </p>
                <p className="text-xs  md:text-base text-gray-700 leading-relaxed">
                  طراحی تیران استایل از یک فلسفه طراحی خاص پیروی می کند:
                </p>
                <p className="text-xs  md:text-base text-gray-700 leading-relaxed">
                  در گام اول، تیران استایل یک هویت قوی و شناخته شده دارد و در
                  گام دوم، تیران استایل مخصوص افرادی است که از جلوتر بودن در مُد
                  لذت می‌برند و به دنبال درک مفهوم خاص‌تری از سبک زندگی هستند و
                  انتخاب‌های شجاعانه‌ای دارند. ماموریت ما در تیران استایل، ارائه
                  محصولاتی است که به مشتریانمان کمک می‌کند تا سبک زندگی خود را
                  با جسارت و اصالت تعریف کنند و از دیگران متمایز شوند.{" "}
                </p>
              </div>
              {/* TIRAN STYLE Heading */}
              <Image
                src={"/assets/images/TIRAN.png"}
                alt="TIRAN STYLE"
                width={300}
                height={200}
                className="mt-40 mx-auto"
              />
            </div>
          </div>
        </section>{" "}
        {/* Our Team Section */}
        <section
          className="min-h-screen flex-shrink-0 h-screen py-16 lg:py-24"
          dir="rtl"
        >
          <div
            className="
      flex 
      flex-row  
      justify-start 
      items-center
      gap-16
      w-[2680px] 
      mx-auto
      px-8
    "
          >
            {/* Title and Description */}
            <div className="w-[400px] mt-40 md:mt-0 text-center flex-shrink-0">
              <h2 className={`md:text-3xl text-lg  ${AriaBold.className}   text-gray-900 mb-8`}>
                اعضای تیم ما
              </h2>
              <p className="text-xs md:text-lg text-gray-600 leading-relaxed ">
                تیران استایل، با تکیه بر شعار الهام‌بخش استایل جور دیگر…، برندی
                پیشرو در فشن، تکنولوژی و لایف‌استایل است که برای افراد خاص و
                جسور طراحی شده است. ما با تمرکز بر ارائه محصولات منحصربه‌فرد،
                سلیقه مشتریانمان را به بالاترین سطح ارتقا می‌دهیم.
              </p>
            </div>

            {/* Team Images Row */}
            <div className="flex flex-row md:gap-10 gap-3 -ml-5 md:ml-1">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center group"
                >
                  <div className="w-full relative h-full mt-8">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      width={4000}
                      height={4000}
                      className=" object-cover h-120 "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0  transition-opacity duration-300"></div>
                  </div>
                  <h3 className={` ${AriaBold.className} text-xl mt-4`}>{member.name}</h3>
                  <p className="text-base opacity-80">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Contact Section - Text Left (Black BG), Image Right */}
        <section className="min-h-screen flex-shrink-0 w-screen  snap-start  pt-20 flex flex-col lg:flex-row">
          {/* Text Content with Black Background - Left Side */}
          <div className="w-full lg:w-3/5 bg-black flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 xl:px-16 order-2 lg:order-1 py-16 lg:py-0">
            <div className="w-full max-w-2xl">
              {/* Top Text Box */}
              <div className="mb-8 lg:mb-12 text-center">
                <h2 className={`text-xl  ${AriaBold.className}  md:text-2xl text-white mb-6 md:mb-30 leading-tight`}>
                  ماموریت ما
                </h2>

                <p className="text-base  md:text-lg text-gray-400 leading-relaxed mb-6 md:mb-30">
                  تیران استایل، با تکیه بر شعار الهام‌بخش استایل جور دیگر…،
                  برندی پیشرو در فشن، تکنولوژی و لایف‌استایل است که برای افراد
                  خاص و جسور طراحی شده است. ما با تمرکز بر ارائه محصولات
                  منحصربه‌فرد، سلیقه مشتریانمان را به بالاترین سطح ارتقا
                  می‌دهیم.{" "}
                </p>
                {/* Contact Button */}
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center px-8 py-4  ${AriaBold.className} text-lg font-semibold text-white  transform hover:scale-105 transition-all duration-300`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  تماس با ما
                </Link>
              </div>
            </div>
          </div>

          {/* Image - Right Side */}
          <div className="w-full lg:w-2/5 relative h-64 sm:h-80 md:h-96 lg:h-auto order-1 lg:order-2">
            <Image
              src="/assets/images/fashion/4.avif" // You can change this to your desired image
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
