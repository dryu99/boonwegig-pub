import createIntlMiddleware from "next-intl/middleware";
import { LocaleConfig } from "./lib/locale";
import { NextRequest } from "next/server";
import { DEFAULT_CITY_COOKIE_NAME } from "./lib/city";

// TODO might be able to optimize this by checking req header for location to auto set default city
export default async function middleware(request: NextRequest) {
  // const [, locale, pathname] = request.nextUrl.pathname.split("/");

  // // when on "/" or "/[locale]"
  // const cityPathExists = pathname !== undefined;
  // if (!cityPathExists) {
  //   const defaultCity = request.cookies.get(DEFAULT_CITY_COOKIE_NAME)?.value;
  //   if (defaultCity) {
  //     request.nextUrl.pathname = `/${defaultCity}`;
  //   }
  // }

  const handleI18nRouting = createIntlMiddleware({
    locales: LocaleConfig.locales,
    defaultLocale: LocaleConfig.defaultLocale,
  });

  const response = handleI18nRouting(request);

  return response;
}

// TODO don't apply locale to admin/ route: https://next-intl-docs.vercel.app/docs/routing/middleware
export const config = {
  // regex that determines which paths will invoke the middleware
  matcher: ["/", "/(en|ko)/:path*"], // TODO would be nice to make this dynamic but using join() doesn't seem to work
};
