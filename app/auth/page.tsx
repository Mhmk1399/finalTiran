import AuthPage from "@/components/static/auth-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری | تیران",
  description:
    "برای ورود به سایت تیران، شماره موبایل خود را وارد کنید و کد تایید را دریافت نمایید. ورود سریع و ایمن به پنل کاربری.",
  keywords: [
    "ورود تیران",
    "صفحه ورود تیران",
    "تایید شماره موبایل",
    "کد تایید پیامکی",
    "ورود به حساب کاربری",
    "تیران",
    "پنل کاربری تیران",
    "ورود آسان با موبایل",
  ],
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  applicationName: "تیران",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "تیران",
  publisher: "تیران",
  robots: {
    index: false, // چون صفحه ورود بهتر است توسط گوگل ایندکس نشود
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "ورود به حساب کاربری | تیران",
    description:
      "برای ورود به حساب کاربری خود در تیران، شماره موبایل‌تان را وارد کرده و کد تایید دریافت کنید.",
    url: "https://www.tiranstyle.com/auth",
    siteName: "تیران",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "https://www.tiranstyle.com/assets/images/og-login.jpg", // ← تصویر مناسب برای اشتراک در شبکه‌های اجتماعی
        width: 1200,
        height: 630,
        alt: "صفحه ورود تیران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ورود به حساب کاربری | تیران",
    description:
      "برای ورود سریع و امن به حساب تیران، شماره موبایل خود را وارد کنید.",
    images: ["https://www.tiranstyle.com/assets/images/og-login.jpg"],
    site: "@tiran_site", // ← اگر دارید
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/auth",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/auth",
    },
  },
  category: "authentication",
};
const Auth = () => {
  return (
    <main>
      <AuthPage />
    </main>
  );
};

export default Auth;
