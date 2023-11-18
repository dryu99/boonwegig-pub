// TODO this isn't great but i dont know how to get static translations working without prop drilling
export type StaticTranslations = {
  loadMore: string;
  link: string;
  free: string;
  new: string;
};

// TODO this is duplicated with middleware.ts contents but importing there breaks css
export const LocaleConfig = {
  locales: ["en", "ko"],
  defaultLocale: "en",
};

// TODO consider adding a "locale" col to the DB venue table instead of doing this
export const LocaleToCountryMap: Record<string, string[]> = {
  en: ["CA", "US"],
  ko: ["KR"],
};
