import "./lib/polyfill";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./lib/i18n";
import { NextResponse, type NextRequest } from "next/server";

const handleIntl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest) {
  // 1. Handle internationalization routing
  const response = handleIntl(request);

  // 2. Supabase session refresh
  // Wrapped in a try-catch to ensure the Edge Runtime never crashes the public site
  try {
    const { updateSession } = await import("./lib/supabase/middleware");
    const session = await updateSession(request);
    
    // Safely sync cookies from Supabase session refresh to the intl response
    const cookies = session.response.cookies.getAll();
    for (const cookie of cookies) {
      response.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        // Ensure we don't pass invalid options to Next.js cookie setter
        domain: cookie.domain,
        path: cookie.path,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
      });
    }
  } catch (error) {
    console.warn("Supabase middleware skipped/failed:", error);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
