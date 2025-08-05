import SmoothScrollProvider from "@/components/global/smoothScrollProvider.tsx";
import HomeContainer from "@/components/static/home-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه اینترنتی تیران | خرید هوشمند، تجربه‌ای متفاوت",
  description:
    "به فروشگاه تیران خوش آمدید. ارائه بهترین محصولات با تضمین کیفیت، قیمت مناسب و ارسال سریع. تیران انتخاب اول برای خرید اینترنتی.",
  keywords: [
    "فروشگاه تیران",
    "خرید اینترنتی",
    "قیمت مناسب",
    "ارسال سریع",
    "تضمین کیفیت",
    "فروشگاه آنلاین",
    "تیران مارکت",
    "محصولات با کیفیت",
  ],
  applicationName: "تیران",
  generator: "Next.js",
  creator: "تیم تیران",
  publisher: "تیران",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "فروشگاه اینترنتی تیران | خرید هوشمند، تجربه‌ای متفاوت",
    description:
      "خرید از فروشگاه اینترنتی تیران با تنوع کالا، قیمت رقابتی و ارسال سریع. تیران، تجربه‌ای لذت‌بخش از خرید آنلاین.",
    url: "https://www.tiranstyle.com/",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-home.jpg", // ← تصویر اختصاصی از صفحه اصلی
        width: 1200,
        height: 630,
        alt: "خرید از فروشگاه تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فروشگاه اینترنتی تیران | خرید هوشمند، تجربه‌ای متفاوت",
    description:
      "خرید هوشمند از فروشگاه تیران با تنوع، تضمین کیفیت و ارسال سریع. همین حالا تجربه کن!",
    images: ["https://www.tiranstyle.com/assets/images/og-home.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/",
    },
  },
  category: "ecommerce",
};

export default function Home() {
  return (
    <main className="">
      <HomeContainer />
      <SmoothScrollProvider />
    </main>
  );
}
