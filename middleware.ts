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
  try {
    const session = await updateSession(request);
    const response = handleIntl(request);
    
    // Safely sync cookies from Supabase session refresh to the intl response
    session.response.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    return response;
  } catch (error) {
    console.error("Middleware crash prevented:", error);
    // Fallback to just intl routing if Supabase refresh fails entirely
    return handleIntl(request);
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
