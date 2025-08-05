import SmoothScrollProvider from "@/components/global/smoothScrollProvider.tsx";
import HelpContainer from "@/components/static/help-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "راهنمای خرید و استفاده از خدمات | فروشگاه تیران",
  description:
    "در این بخش با نحوه ثبت سفارش، شرایط ارسال، بازگشت کالا، پشتیبانی و سوالات متداول در فروشگاه تیران آشنا شوید.",
  keywords: [
    "راهنمای خرید",
    "سوالات متداول",
    "نحوه ثبت سفارش",
    "ارسال کالا",
    "بازگشت کالا",
    "پشتیبانی تیران",
    "تماس با ما",
    "راهنمای خدمات تیران",
  ],
  applicationName: "تیران",
  creator: "تیم تیران",
  publisher: "تیران",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "راهنمای استفاده از فروشگاه تیران | پشتیبانی و سوالات متداول",
    description:
      "پاسخ به سوالات متداول، اطلاعات ثبت سفارش، شرایط ارسال و بازگشت کالا در تیران. برای تجربه‌ای راحت از خرید آنلاین، این صفحه را بخوانید.",
    url: "https://www.tiranstyle.com/help",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-help.jpg",
        width: 1200,
        height: 630,
        alt: "راهنمای خرید از تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "راهنمای خرید از تیران | سوالات متداول و پشتیبانی",
    description:
      "با مطالعه راهنمای خرید تیران، با فرایند سفارش، ارسال، بازگشت و خدمات مشتری آشنا شوید.",
    images: ["https://www.tiranstyle.com/assets/images/og-help.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/help",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/help",
    },
  },
  category: "support",
};

export default function HelpPage() {
  return (
    <main>
      <HelpContainer />
      <SmoothScrollProvider />
    </main>
  );
}
