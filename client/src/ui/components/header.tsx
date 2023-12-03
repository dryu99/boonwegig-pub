"use client";
// TODO i'm 99% sure this doesn't need to be a client component,
//      but b/c our header is in locale/ path and not locale/city/ it doesn't have access to city on server side
//      if there's a way to get city on server side (or maybe move header component somewhere else)
//      we should look into that

// import { Link, usePathname } from "@/lib/navigation";
import Link from "next/link";
import { LocalePicker } from "./locale-picker";
import { CityPicker } from "./city-picker";
import { AppLocale } from "@/lib/locale";
import clsx from "clsx";
import { CITIES, AppCity } from "@/lib/city";
import { notFound, usePathname } from "next/navigation";
import { HeaderTranslations } from "@/lib/translation";

export const Header = ({
  locale,
  translations,
}: {
  locale: AppLocale;
  translations: HeaderTranslations;
}) => {
  // TODO if you ever go back to using useTranslations: this is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const [, _locale, city] = usePathname().split("/");

  // if page is on city path, check if city is valid
  // TODO this is terribad, we should be able to get city from server side, but it'll do for now lol

  // TODO kinda weird we're doing this 404 redirect in the header lol, should prob go in locale layout or sth
  if (!CITIES.includes(city as AppCity)) notFound();

  return (
    <div className="flex flex-row justify-between text-center w-full mb-2 bg-secondary text-black py-2 px-3 sm:px-8">
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <h1 className="text-2xl mb-1 font-bold mr-3">
            <Link href={`/${city ?? ""}`}>{translations.title}</Link>
          </h1>
          {/* only render city related components if city was picked */}
          {city && (
            <CityPicker
              initialCity={city as AppCity}
              translations={translations}
            />
          )}
        </div>
        {city && (
          <div
            className={clsx("flex flex-row", {
              "text-sm pb-1": locale === "ko",
            })}
          >
            <Link
              className="mr-2 hover:underline"
              href={`/${locale}/${city}`}
              data-umami-event="header-shows-link"
            >
              {translations.shows}/
            </Link>
            <Link
              className="mr-2 hover:underline"
              href={`/${locale}/${city}/venues/`}
              data-umami-event="header-venues-link"
            >
              {translations.venues}/
            </Link>
            <Link
              className="mr-2 hover:underline"
              href={`/${locale}/${city}/artists/`}
              data-umami-event="header-artists-link"
            >
              {translations.artists}/
            </Link>
          </div>
        )}
      </div>
      <div className="pt-[5px]">
        <LocalePicker />
      </div>
    </div>
  );
};
