import createMiddleware from "next-intl/middleware";
import { LocaleConfig } from "./lib/locale";

export default createMiddleware({
  locales: LocaleConfig.locales,
  defaultLocale: LocaleConfig.defaultLocale,
});

// TODO don't apply locale to admin/ route: https://next-intl-docs.vercel.app/docs/routing/middleware
export const config = {
  // regex that determines which paths will invoke the middleware
  matcher: ["/", "/(en|ko)/:path*"], // TODO would be nice to make this dynamic but using join() doesn't seem to work
};
