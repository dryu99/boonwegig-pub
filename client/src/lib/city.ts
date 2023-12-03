import { AppLocale } from "./locale";

export const CITIES: AppCity[] = ["seoul", "busan"];
export const DEFAULT_CITY_COOKIE_NAME = "DEFAULT_CITY";

export type AppCity = "seoul" | "busan";

export const localeToCityMap: Record<AppLocale, Record<AppCity, string>> = {
  en: {
    seoul: "Seoul",
    busan: "Busan",
  },
  ko: {
    seoul: "서울",
    busan: "부산",
  },
};
