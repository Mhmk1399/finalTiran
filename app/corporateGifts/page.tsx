import SmoothScrollProvider from "@/components/global/smoothScrollProvider.tsx";
import CorporateGiftsContainer from "@/components/static/Corporate-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "هدایای سازمانی اختصاصی | فروشگاه تیران",
  description:
    "سفارش انواع هدایای سازمانی، تبلیغاتی و لوکس برای مناسبت‌ها و رویدادهای شرکتی. با تیران، برند شما در ذهن‌ها می‌ماند.",
  keywords: [
    "هدایای سازمانی",
    "هدایای تبلیغاتی",
    "هدایای شرکتی",
    "سفارش هدیه سازمانی",
    "هدیه اختصاصی برای شرکت",
    "هدایای مشتریان",
    "تیران هدایای سازمانی",
  ],
  applicationName: "تیران",
  creator: "تیم برندینگ تیران",
  publisher: "فروشگاه تیران",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "هدایای سازمانی | سفارش هدیه‌های اختصاصی با برند شما",
    description:
      "طراحی و تولید هدایای سازمانی با کیفیت بالا و بسته‌بندی لوکس برای شرکت‌ها، بانک‌ها، استارتاپ‌ها و سازمان‌های بزرگ. ثبت سفارش آسان از تیران.",
    url: "https://www.tiranstyle.com/gift-corporate",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-gift-corporate.jpg",
        width: 1200,
        height: 630,
        alt: "هدایای تبلیغاتی و سازمانی تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "هدایای سازمانی تیران | هدیه‌ای ماندگار برای مشتریان شما",
    description:
      "با تیران، بهترین هدایای شرکتی و تبلیغاتی را برای تقویت برند خود انتخاب کنید. کیفیت، طراحی خاص و بسته‌بندی حرفه‌ای.",
    images: ["https://www.tiranstyle.com/assets/images/og-gift-corporate.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/gift-corporate",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/gift-corporate",
    },
  },
  category: "business, corporate gifts",
};

const CorporateGiftsPage = () => {
  return (
    <main>
      <CorporateGiftsContainer />
      <SmoothScrollProvider />
    </main>
  );
};

export default CorporateGiftsPage;
