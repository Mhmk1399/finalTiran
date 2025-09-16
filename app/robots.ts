import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tiranstyle.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/blog",
          "/blog/*",
          "/contact",
          "/corporateGifts",
          "/giftCart",
          "/help",
          "/shop",
          "/shop/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/auth",
          "/cart",
          "/checkout/*",
          "/_next/*",
          "/private/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about",
          "/blog",
          "/blog/*",
          "/contact",
          "/corporateGifts",
          "/giftCart",
          "/help",
          "/shop",
          "/shop/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
          "/auth",
          "/cart",
          "/checkout/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
