import GiftCardsContainer from "@/components/static/gift-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خرید گیفت کارت فروشگاه تیران | هدیه‌ای خاص برای عزیزان شما",
  description:
    "با خرید گیفت کارت فروشگاه تیران، یک هدیه ارزشمند و قابل انتخاب به عزیزانتان بدهید. مناسب برای هر مناسبت و کاربردی در تمام خریدهای فروشگاه.",
  keywords: [
    "گیفت کارت تیران",
    "خرید گیفت کارت",
    "هدیه فروشگاه تیران",
    "کارت هدیه دیجیتال",
    "گیفت کارت مناسبتی",
    "کارت هدیه تولد",
    "کارت اعتباری خرید",
  ],
  applicationName: "تیران",
  creator: "تیم فروشگاه تیران",
  publisher: "فروشگاه تیران",
  authors: [{ name: "Tiran Team", url: "https://www.tiranstyle.com/" }],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },

  twitter: {
    card: "summary_large_image",
    title: "گیفت کارت تیران | هدیه‌ای خاص، انتخابی آزاد",
    description:
      "با گیفت کارت تیران، قدرت انتخاب را به دوستانتان هدیه دهید. مناسب تولد، سالگرد و مناسبت‌های خاص.",
    images: ["https://www.tiranstyle.com/assets/images/og-gift.jpg"],
    site: "@tiran_site",
    creator: "@tiran_site",
  },
  alternates: {
    canonical: "https://www.tiranstyle.com/gift-cards",
    languages: {
      "fa-IR": "https://www.tiranstyle.com/gift-cards",
    },
  },
  category: "gift cards",
};

const GiftCardsPage = () => {
  return (
    <main>
      <GiftCardsContainer />
    </main>
  );
};

export default GiftCardsPage;
