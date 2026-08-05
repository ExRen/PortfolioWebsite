import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://portfolio-bima-eosin.vercel.app";
  return ["en", "id"].map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    alternates: { languages: { en: `${base}/en`, id: `${base}/id` } },
  }));
}
