import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/i18n-config";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the pathname already has a locale prefix
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    const locale = pathname.split("/")[1];
    // Forward the locale to next-intl Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-intl-locale", locale);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Redirect to the default locale if no prefix is present
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
