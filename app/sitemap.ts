import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/fetcher";

const BASE = "https://www.portfolio-bima.web.id";
const LOCALES = ["en", "id"] as const;

function langAlternates(path: string): Record<string, string> {
  return {
    "x-default": `${BASE}/en${path}`,
    en: `${BASE}/en${path}`,
    id: `${BASE}/id${path}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE}/${locale}`,
      lastModified: new Date(),
      alternates: { languages: langAlternates("") },
    });
    entries.push({
      url: `${BASE}/${locale}/blog`,
      lastModified: new Date(),
      alternates: { languages: langAlternates("/blog") },
    });
    for (const p of posts) {
      entries.push({
        url: `${BASE}/${locale}/blog/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        alternates: { languages: langAlternates(`/blog/${p.slug}`) },
      });
    }
    for (const p of projects) {
      const slug = p.slug ?? String(p.id);
      entries.push({
        url: `${BASE}/${locale}/projects/${slug}`,
        lastModified: new Date(),
        alternates: { languages: langAlternates(`/projects/${slug}`) },
      });
    }
  }
  return entries;
}
