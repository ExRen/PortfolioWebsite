import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n-config";
import { type NextRequest } from "next/server";

const handleIntl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // Handle internationalization routing
  // Removed Supabase session refresh to prevent Edge Runtime crash
  return handleIntl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
