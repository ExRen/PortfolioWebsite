import { getPosts } from "@/lib/fetcher";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

const BASE = "https://portfolio-bima-eosin.vercel.app";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const id = locale === "id";
  let items = "";
  try {
    const posts = await getPosts();
    items = posts
      .slice()
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
      .slice(0, 20)
      .map((p) => {
        const title = id ? p.title_id : p.title_en;
        const excerpt = id ? p.excerpt_id : p.excerpt_en;
        const url = `${BASE}/${locale}/blog/${p.slug}`;
        const date = p.published_at ?? p.updated_at ?? new Date().toISOString();
        return (
          `    <item>\n` +
          `      <title>${esc(title)}</title>\n` +
          `      <link>${esc(url)}</link>\n` +
          `      <guid>${esc(url)}</guid>\n` +
          `      <description>${esc(excerpt)}</description>\n` +
          `      <pubDate>${esc(new Date(date).toUTCString())}</pubDate>\n` +
          `    </item>`
        );
      })
      .join("\n");
  } catch {
    items = "";
  }
  const channelTitle = id ? "Bima Aryadinata — Tulisan" : "Bima Aryadinata — Writing";
  const channelDesc = id
    ? "Dispatches teknik oleh Bima Aryadinata"
    : "Engineering dispatches by Bima Aryadinata";
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n` +
    `  <channel>\n` +
    `    <title>${esc(channelTitle)}</title>\n` +
    `    <link>${esc(`${BASE}/${locale}/blog`)}</link>\n` +
    `    <description>${esc(channelDesc)}</description>\n` +
    `    <language>${id ? "id" : "en-us"}</language>\n` +
    items +
    (items ? "\n" : "") +
    `  </channel>\n` +
    `</rss>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
