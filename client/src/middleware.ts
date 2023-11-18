import createMiddleware from "next-intl/middleware";
import { LocaleConfig } from "./lib/locale";

export default createMiddleware({
  locales: LocaleConfig.locales,
  defaultLocale: LocaleConfig.defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"], // TODO would be nice to make this dynamic but using join() doesn't seem to work
};
