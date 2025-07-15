export const navItems = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "/shop" },
  { name: "راهنما", href: "/help" },
  { name: "بلاگ", href: "/blog" },
  { name: "درباره", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
  // { name: "گیفت کارت", href: "/giftCart" },
  // { name: "هدایای سازمانی", href: "/corporateGifts" },
];

// Categories with subcategories
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
      when: "afterChildren",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeInOut" as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export const categoryVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const categoryItemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

export const logoVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: "easeInOut" as const,
      yoyo: Infinity,
    },
  },
};

export const desktopCategoryRowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export const desktopCategoryItemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    color: "#000",
    transition: { duration: 0.2 },
  },
};
