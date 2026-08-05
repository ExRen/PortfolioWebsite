import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/en/admin", "/id/admin"] },
    sitemap: "https://portfolio-bima-eosin.vercel.app/sitemap.xml",
  };
}
