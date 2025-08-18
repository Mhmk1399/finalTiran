"use client";

import React from "react";
import Image from "next/image";
import { AriaBold } from "@/next-persian-fonts/woff2";
import Link from "next/link";

const CorporateGiftsContainer = () => {
  return (
    <div className="min-h-screen lg:pt-20 bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 pr-8 order-2 lg:order-1">
              <h1
                className={`text-4xl md:text-4xl leading-tight mb-8 ${AriaBold.className} text-black`}
              >
                هدایای سازمانی <br /> تیــــران استایل
              </h1>
              <p className="md:text-base text-sm text-gray-600 leading-relaxed mb-8">
                هدایای سازمانی یکی از بهترین راهها برای تقویت روابط با کارکنان،
                شرکا و مشتریان است. در تیران استایل، ما مجموعهای از هدایای خاص و
                منحصر به فرد را برای سازمانها فراهم کردهایم.
              </p>
            </div>
            <div className="lg:col-span-8 relative h-96 lg:h-[500px] order-1 lg:order-2">
              <Image
                src="/assets/images/0e8cc3.jpg"
                alt="هدایای سازمانی تیران استایل"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            هدایای سازمانی ما با طراحیهای شیک و جذاب، نمادی از احترام و توجه شما
            به جزئیات هستند. چه برای تقدیر از کارکنان برتر، چه به عنوان هدایای
            تبلیغاتی برای مشتریان ویژه، محصولات ما میتوانند تاثیرگذاری طولانیمدت
            داشته باشند.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className={`text-2xl md:text-2xl ${AriaBold.className} text-black mb-8`}
              >
                هدایای سازمانی تیران استایل:
              </h2>
              <div className="space-y-2 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-blue-700">شخصی سازی : </strong>
                  امکان درج لوگو یا پیام شخصی شما بر روی محصولات، برای ایجاد
                  هدایایی منحصربهفرد.
                </p>
                <p>
                  <strong className="text-blue-700"> کیفیت برتر : </strong>
                  تمامی محصولات ما از بهترین مواد و با دقت بالا ساخته شدهاند تا
                  ارزش واقعی هدیه را نشان دهند.
                </p>
                <p>
                  <strong className="text-blue-700"> مجموعهای متنوع: : </strong>
                  از اکسسوریهای مد روز تا محصولات لوکس، ما گزینههای متنوعی را
                  برای نیازهای مختلف سازمانی ارائه میدهیم.{" "}
                </p>
                <p>
                  برای کسب اطلاعات بیشتر و سفارش هدایای سازمانی اختصاصی، با تیم
                  ما تماس بگیرید. اجازه دهید تا با هدایای تیران استایل، نام شما
                  در ذهنها ماندگار شود{" "}
                </p>
              </div>
            </div>
            <div className="relative h-100">
              <Image
                src="/assets/images/b205bc.jpg"
                alt="هدایای سازمانی"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className={`text-2xl text-black mb-1 ${AriaBold.className} `}>
              همکاران تجاری و سازمانی
            </h2>
            <p className="font-light text-gray-400">Our Partnerships</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              {
                logo: "/assets/images/company/algorock.svg",
                link: "https://algorock.com/",
              },
              {
                logo: "/assets/images/company/almascarpet.png",
                link: "https://almascarpet.com/",
              },
              {
                logo: "/assets/images/company/asayeshgaahtdoniya.png",
                link: "https://asayeshgaahtdoniya.com/",
              },
              {
                logo: "/assets/images/company/avapardaz.svg",
                link: "https://avapardaz.ir/fa/",
              },
              {
                logo: "/assets/images/company/bapet.png",
                link: "https://bapet.shop/",
              },
              {
                logo: "/assets/images/company/investorun.png",
                link: "https://www.investorun.com/",
                bg: "bg-black",
              },
              {
                logo: "/assets/images/company/macneed.png",
                link: "https://macneed.ir/",
              },
              {
                logo: "/assets/images/company/pourgolshani.png",
                link: "https://www.instagram.com/dr.pourgolshani?igsh=NGIzbGhkbDZ3dWVn",
              },
              {
                logo: "/assets/images/company/ravro.png",
                link: "https://www.ravro.ir/",
              },
              {
                logo: "/assets/images/company/spara.svg",
                link: "https://spara.ir/",
              },
              {
                logo: "/assets/images/company/wrc-group.png",
                link: "https://wrc-group.com/",
              },
              {
                logo: "/assets/images/company/zoodex.svg",
                link: "https://zoodex.ir/",
              },
            ].map((company, index) => (
              <div key={index} className="p-4">
                <Link href={company.link}>
                  <Image
                    src={company.logo}
                    alt={`شرکت ${index + 1}`}
                    width={120}
                    height={60}
                    className={`object-contain transition-all ${
                      company.bg || ""
                    }`}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateGiftsContainer;
