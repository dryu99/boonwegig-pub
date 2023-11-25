export type AppLocale = "en" | "ko";

// TODO this is duplicated with middleware.ts contents but importing there breaks css
export const LocaleConfig: {
  locales: AppLocale[];
  defaultLocale: "en";
} = {
  locales: ["en", "ko"],
  defaultLocale: "en",
};

// TODO consider adding a "locale" col to the DB venue table instead of doing this
export const LocaleToCountryMap: Record<string, string[]> = {
  en: ["CA", "US"],
  ko: ["KR"],
};
