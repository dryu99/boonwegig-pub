import { ClientVenue } from "./database/db-manager";
import { AppLocale, LocaleToCountryMap } from "./locale";

export const getLocalizedVenueName = (
  venue: ClientVenue,
  locale: AppLocale
) => {
  return LocaleToCountryMap[locale].includes(venue.country) && venue.localName
    ? venue.localName
    : venue.name;
};
