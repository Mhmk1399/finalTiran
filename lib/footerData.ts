import { ContactInfoItem } from "@/types/type";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/tiranstyle/profilecard/?igsh=M3V3ZjEwMTdjMGs1",
    icon: FaInstagram,
  },
  {
    name: "Twitter",
    href: "https://www.linkedin.com/company/tiran-style/",
    icon: FaTwitter,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/tiran-style/",
    icon: FaLinkedin,
  },
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
export const Accsses = [
  { name: "درباره ما", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
];
export const customersServices = [
  { name: "پرسش های متداول", href: "/" },
  { name: "بلاگ", href: "/blog" },
  { name: "ثبت شکایات", href: "/contact#contact-form" },
  { name: "کارت هدیه", href: "/giftCart" },
];
export const Help = [
  { name: "راهنما", href: "/help" },
  { name: "نحوه ثبت نام", href: "/" },
  { name: "شیوه های پرداخت", href: "/" },
];
