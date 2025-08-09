"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { FaRegHandshake } from "react-icons/fa";
import Link from "next/link";
import { AriaBold } from "@/next-persian-fonts/woff2";
import { corporateFeatures, services, stats } from "@/lib/corporate";

gsap.registerPlugin(ScrollTrigger);

const CorporateGiftsContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 85%",
          },
        }
      );

      document.querySelectorAll(".feature-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -5, duration: 0.3 });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.3 });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen  bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative px-4 min-h-screen flex justify-center items-center">
        <div className="max-w-4xl mx-auto text-center hero-content">
          <h1
            className={`text-4xl md:text-8xl  mb-8 ${AriaBold.className} text-black`}
          >
            هدایای سازمانی
          </h1>
          <div className="w-24 h-px bg-black mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center leading-relaxed">
            هدایای سازمانی یکی از بهترین راه‌ها برای تقویت روابط با کارکنان،
            شرکا و مشتریان است. در تیران استایل، ما مجموعه‌ای از هدایای خاص و
            منحصر به فرد را برای سازمان‌ها فراهم کرده‌ایم تا به شما کمک کنیم
            قدردانی خود را با بهترین کیفیت و سبک به نمایش بگذارید{" "}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20  stats-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-item text-center">
                  <IconComponent className="text-3xl text-black mx-auto mb-4" />
                  <div className="text-4xl font-light text-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-black mb-4">خدمات ما</h2>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corporateFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="feature-card group cursor-pointer"
                >
                  <div className="border border-gray-200 p-8 h-full hover:border-black transition-colors duration-300">
                    <IconComponent className="text-2xl text-black mb-6" />
                    <h3 className="text-xl font-medium text-black mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              {" "}
              مزایای هدایای سازمانی تیران استایل
            </h2>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 justify-center items-center gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                <p className="text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-black mb-8">
                هدایای سازمانی تیران استایل
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  هدایای سازمانی ابزاری قدرتمند برای تقویت روابط با کارکنان،
                  مشتریان و شرکای تجاری هستند. این هدایا نه تنها نشان‌دهنده
                  قدردانی و احترام شما هستند، بلکه باعث تقویت هویت برند و ایجاد
                  تجربه‌ای ماندگار در ذهن دریافت‌کنندگان می‌شوند.
                </p>
                <p>
                  در تیران استایل، ما با درک عمیق از نیازهای سازمان‌ها و با
                  بهره‌گیری از تجربه چندین ساله در زمینه طراحی و تولید محصولات
                  لوکس، مجموعه‌ای منحصربه‌فرد از هدایای سازمانی را ارائه
                  می‌دهیم.
                </p>
                <p>
                  تمامی محصولات ما با دقت و توجه به جزئیات طراحی و تولید می‌شوند
                  تا نه تنها زیبایی ظاهری داشته باشند، بلکه کیفیت و دوام بالایی
                  نیز داشته باشند. این امر باعث می‌شود که هدیه شما برای مدت
                  طولانی مورد استفاده قرار گیرد و نام برند شما همواره در ذهن
                  باقی بماند.
                </p>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="/assets/images/fashion/4.avif"
                alt="هدایای سازمانی تیران استایل"
                fill
                className="object-cover "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-black mb-4">
              فرآیند همکاری
            </h2>
            <div className="w-16 h-px bg-black mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "مشاوره",
                desc: "بررسی نیازها و ارائه پیشنهادات",
              },
              {
                step: "02",
                title: "طراحی",
                desc: "طراحی اختصاصی متناسب با برند",
              },
              { step: "03", title: "تولید", desc: "تولید با بالاترین کیفیت" },
              { step: "04", title: "تحویل", desc: "بسته‌بندی و ارسال به موقع" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-light text-black mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FaRegHandshake className="text-4xl mx-auto mb-8" />
          <h2 className="text-4xl font-light mb-8">
            آماده همکاری با شما هستیم
          </h2>
          <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed">
            برای دریافت مشاوره رایگان و کسب اطلاعات بیشتر درباره خدمات هدایای
            سازمانی، همین امروز با ما تماس بگیرید.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-white px-12 py-4 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            تماس با ما
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CorporateGiftsContainer;
