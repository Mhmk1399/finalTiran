import SmoothScrollProvider from "@/components/global/smoothScrollProvider.tsx";
import AboutContainer from "@/components/static/about-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما | فروشگاه لباس تیران",
  description:
    "با فروشگاه لباس تیران بیشتر آشنا شوید؛ از داستان شکل‌گیری، ارزش‌ها، اهداف و تعهد ما به کیفیت و رضایت مشتری.",
  keywords: [
    "درباره ما تیران",
    "فروشگاه لباس تیران",
    "برند تیران",
    "اهداف فروشگاه تیران",
    "لباس مردانه و زنانه",
    "فروشگاه آنلاین پوشاک",
    "کیفیت پوشاک ایرانی",
    "تولید ملی لباس",
  ],
  applicationName: "فروشگاه تیران",
  creator: "تیم برند تیران",
  publisher: "Tiran",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "درباره ما | فروشگاه لباس تیران",
    description:
      "ما در تیران به طراحی، تولید و ارائه پوشاک با کیفیت ایرانی افتخار می‌کنیم. با ما و مسیر رشد برند تیران بیشتر آشنا شوید.",
    url: "https://www.tiranstyle.com/about",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "درباره فروشگاه تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما | فروشگاه لباس تیران",
    description:
      "آشنایی با اهداف، ارزش‌ها و داستان برند تیران. ما در مسیر پوشاک با کیفیت ایرانی همراه شما هستیم.",
    images: ["https://www.tiranstyle.com/assets/images/.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/about",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/about",
    },
  },
  category: "لباس، فروشگاه، برند ایرانی، درباره ما",
};

export default function AboutPage() {
  return (
    <main className="">
      <AboutContainer />
      <SmoothScrollProvider />
    </main>
  );
}
