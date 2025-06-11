import { ContactInfoItem } from "@/types/type";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from "react-icons/fa";

export const socialLinks = [
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Twitter", href: "#", icon: FaTwitter },
  { name: "LinkedIn", href: "#", icon: FaLinkedin },
  { name: "Telegram", href: "#", icon: FaTelegram },
];

export const contactInfo: ContactInfoItem[] = [
  {
    label: "شماره تماس",
    value: "۰۲۱-۱۲۳۴۵۶۷۸",
    icon: FaPhone,
    isLink: true,
    href: "tel:+982112345678",
  },
  {
    label: "ایمیل",
    value: "info@msl-chandeliers.com",
    icon: FaEnvelope,
    isLink: true,
    href: "mailto:info@msl-chandeliers.com",
  },
  {
    label: "آدرس",
    value: "تهران، خیابان ولیعصر، پاساژ نور",
    icon: FaMapMarkerAlt,
    isLink: true,
    href: "mapgoogle.com",
  },
];
export const MainLink = [
  { name: "صفحه اصلی", href: "/" },
  { name: "محصولات", href: "/shop" },
  { name: "راهنما", href: "/help" },
  { name: "درباره ما", href: "/about" },
  { name: "وبلاگ", href: "/blog" },
  { name: "تماس با ما", href: "/contact" },
];
