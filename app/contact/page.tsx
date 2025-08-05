import SmoothScrollProvider from "@/components/global/smoothScrollProvider.tsx";
import ContactContainer from "@/components/static/contact-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما | ارتباط با فروشگاه تیران",
  description:
    "راه‌های ارتباط با فروشگاه تیران شامل شماره تماس، آدرس ایمیل، فرم تماس آنلاین و شبکه‌های اجتماعی. همراه شما هستیم.",
  keywords: [
    "تماس با تیران",
    "شماره تماس فروشگاه تیران",
    "فرم تماس با ما",
    "پشتیبانی تیران",
    "آدرس فروشگاه تیران",
    "ارتباط با تیران",
  ],
  applicationName: "فروشگاه تیران",
  creator: "تیم پشتیبانی تیران",
  publisher: "Tiran",
  authors: [{ name: "Tiran Support Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "تماس با ما | فروشگاه تیران",
    description:
      "در صورت داشتن هرگونه سوال، نظر یا درخواست پشتیبانی، با ما از طریق فرم یا راه‌های ارتباطی درج شده در صفحه تماس بگیرید.",
    url: "https://www.tiranstyle.com/contact",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "تماس با فروشگاه تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تماس با ما | فروشگاه تیران",
    description:
      "پشتیبانی سریع و پاسخ‌گو در فروشگاه تیران. با ما در ارتباط باشید و سوالات خود را مطرح کنید.",
    images: ["https://www.tiranstyle.com/assets/images/og-contact.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/contact",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/contact",
    },
  },
  category: "support, ارتباط با ما",
};

export default function ContactPage() {
  return (
    <main>
      <ContactContainer />
      <SmoothScrollProvider />
    </main>
  );
}
