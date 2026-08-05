import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n";
import { updateSession } from "./lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const handleIntl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  const session = await updateSession(request);
  const response = handleIntl(request);
  session.response.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
