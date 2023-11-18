import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ko"],
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"], // TODO would be nice to make this dynamic but using join() doesn't seem to work
};
