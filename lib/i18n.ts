import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Re-exported so existing imports (e.g. app/[locale]/layout.tsx) keep working.
// Middleware must import from "./i18n-config" instead.
import { locales, defaultLocale, type Locale } from "./i18n-config";
export { locales, defaultLocale, type Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as Locale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return {
    locale,
    messages,
  };
});
