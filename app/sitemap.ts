import { MetadataRoute } from "next";

interface BlogPost {
  _id: string;
  updatedAt?: string;
  createdAt: string;
}

interface Product {
  slug: string;
  updatedAt?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  data?: T[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tiranstyle.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/auth",
    "/blog",
    "/cart",
    "/contact",
    "/corporateGifts",
    "/dashboard",
    "/giftCart",
    "/help",
    "/shop",
    "/admin",
  ];

  // Generate static routes
  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.8,
  }));

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogResponse = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    });
    if (blogResponse.ok) {
      const blogs: ApiResponse<BlogPost> = await blogResponse.json();
      blogRoutes =
        blogs.data?.map((blog) => ({
          url: `${baseUrl}/blog/${blog._id}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })) || [];
    }
  } catch {
    console.log("Failed to fetch blog routes for sitemap");
  }

  // Dynamic shop routes
  let shopRoutes: MetadataRoute.Sitemap = [];
  try {
    const shopResponse = await fetch(`${baseUrl}/api/shop`, {
      next: { revalidate: 3600 },
    });
    if (shopResponse.ok) {
      const products: ApiResponse<Product> = await shopResponse.json();
      shopRoutes =
        products.data?.map((product) => ({
          url: `${baseUrl}/shop/${product.slug}`,
          lastModified: new Date(product.updatedAt || product.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })) || [];
    }
  } catch {
    console.log("Failed to fetch shop routes for sitemap");
  }

  return [...staticSitemap, ...blogRoutes, ...shopRoutes];
}
