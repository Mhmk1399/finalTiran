import DashboardPageContainer from "@/components/static/dashboard-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "داشبورد کاربری | مدیریت حساب در فروشگاه تیران",
  description:
    "در داشبورد تیران، وضعیت سفارش‌ها، اطلاعات حساب کاربری و فعالیت‌های خود را به راحتی مدیریت کنید. تجربه‌ای سریع و ساده برای خرید بهتر.",
  keywords: [
    "داشبورد تیران",
    "حساب کاربری تیران",
    "پیگیری سفارش",
    "مدیریت خرید",
    "تنظیمات کاربر",
    "پروفایل فروشگاه",
    "داشبورد فروشگاه آنلاین",
  ],
  applicationName: "تیران",
  creator: "تیم توسعه تیران",
  publisher: "فروشگاه تیران",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: false, // این صفحه نباید در نتایج جستجو ایندکس شود
    follow: false,
  },
  openGraph: {
    title: "داشبورد تیران | حساب کاربری خود را مدیریت کنید",
    description:
      "در داشبورد تیران، به اطلاعات حساب، سفارش‌ها، آدرس‌ها و پیام‌ها دسترسی کامل داشته باشید. پنل کاربری مدرن و ساده برای تجربه خرید بهتر.",
    url: "https://www.tiranstyle.com/dashboard",
    siteName: "فروشگاه تیران",
    locale: "fa_IR",
    type: "profile",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "داشبورد حساب کاربری تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "حساب کاربری تیران | مدیریت سفارش‌ها و اطلاعات شخصی",
    description:
      "وارد پنل کاربری خود در تیران شوید و تمام فعالیت‌های خرید خود را به‌راحتی مدیریت کنید.",
    images: ["https://www.tiranstyle.com/assets/images/og-dashboard.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/dashboard",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/dashboard",
    },
  },
  category: "user dashboard",
};

const DashboardPage = () => {
  return (
    <main>
      <DashboardPageContainer />
    </main>
  );
};

export default DashboardPage;
