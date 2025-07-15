import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/static/navbar";
import { ray } from "@/next-persian-fonts/ray";
import Footer from "@/components/static/footer";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/context/cartContext";
import CanonicalUrl from "@/components/global/CanonicalUrl";
import TopFooterText from "@/components/static/ui/topFooterText";

export const metadata: Metadata = {
  title: "فروشگاه تیران | تجربه‌ای متفاوت از خرید آنلاین",
  description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
  keywords: ["لباس", "فروشگاه تیران", "خرید آنلاین", "مد و پوشاک"],
  authors: [{ name: "تیران", url: "https://www.tiranstyle.com/" }],
  icons: {
    icon: "/favicon.ico", // آیکون استاندارد مرورگر
    shortcut: "/favicon.ico", // آیکون shortcut (برای تب‌ها)
    apple: "/apple-icon.png", // آیکون مخصوص آیفون (اختیاری)
  },
  openGraph: {
    title: "صفحه اصلی | تیران",
    description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
    url: "https://www.tiranstyle.com/",
    siteName: "تیران",
    images: [
      {
        url: "https://www.tiranstyle.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "تیران - فروشگاه مد و پوشاک",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "صفحه اصلی | تیران",
    description: "آشنایی با فروشگاه تیران، ارزش‌ها و اهداف ما",
    images: ["https://www.tiranstyle.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={` ${ray.className} antialiased relative`}>
        <CanonicalUrl />
        <ToastContainer
          position="top-center"
          rtl
          draggable
          draggableDirection="x"
          className={ray.className}
          toastClassName={ray.className}
        />
        <CartProvider>
          <Navbar />

          {children}
<TopFooterText />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
