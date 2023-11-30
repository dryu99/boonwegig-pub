"use server";

import { cookies } from "next/headers";
import { DEFAULT_CITY_COOKIE_NAME } from "./city";

export const setDefaultCityCookie = (city: string) => {
  cookies().set(DEFAULT_CITY_COOKIE_NAME, city, { secure: true });
};
