import {
  fetchManyVenues,
  fetchUpcomingMusicEvents,
  fetchVenueBySlug,
} from "@/lib/actions";
import { AppCity } from "@/lib/city";
import { toInstagramProfileLink } from "@/lib/external-links";
import { AppLocale, LocaleToCountryMap } from "@/lib/locale";
import { unstable_getTranslations } from "@/lib/translation";
import { getLocalizedVenueName } from "@/lib/venue.helper";
import {
  GoogleMapsLink,
  KakaoMapsLink,
  NaverMapsLink,
} from "@/ui/components/external-maps-link";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { InstagramIcon } from "@/ui/svgs/instagram-icon";
import { LocationIcon } from "@/ui/svgs/location-icon";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string; locale: AppLocale; city: AppCity };
};

export const generateMetadata = async ({
  params: { id, locale, city },
}: Props): Promise<Metadata> => {
  const venue = await fetchVenueBySlug(id);
  const t = await getTranslations({
    locale,
    namespace: "VenuePageMetadata",
  });

  if (!venue) return {};

  const venueName = getLocalizedVenueName(venue, locale);
  return {
    title: `${t("venue")}: ${venueName}`,
    description: t("description", { venueName }),
    keywords: t("keywords", { venueName }),
  };
};

export const generateStaticParams = async ({
  params: { locale, city },
}: Props) => {
  const venues = await fetchManyVenues(locale, { filter: { city } });
  return venues.map((v) => ({ id: v.slug }));
};

export default async function VenuePage({ params }: Props) {
  const venue = await fetchVenueBySlug(params.id);

  if (!venue) notFound();

  const externalMapsJson = venue.externalMapsJson;

  // TODO feels kind of bad to do 2 queries, we can prob do 1 in the fetch venue by slug
  //      OR if we want to super optimize, we can make the fetch venue by slug query really simple (only fetch id column)
  //         and after confirming existence we can render page using some suspense magic while the music events are waiting to be fetched
  //      OR we could just do 1 query lol
  const musicEvents = await fetchUpcomingMusicEvents({
    filter: { venueId: venue.id, city: params.city },
  });

  const t = await getTranslations("static"); // TODO this is duplicated from the shows page lol

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="mr-1">
          <LocationIcon width="20px" />
        </div>

        <h2 className="mb-2">{getLocalizedVenueName(venue, params.locale)}</h2>
      </div>
      <div className="flex flex-row justify-center mb-5">
        <a
          className="mx-1"
          href={toInstagramProfileLink(venue.instagramUsername)}
          // data-umami-event="" TODO add this
        >
          <InstagramIcon />
        </a>
        {externalMapsJson?.googleMapsUrl && (
          <div className="mx-1">
            <GoogleMapsLink url={externalMapsJson?.googleMapsUrl} />
          </div>
        )}
        {externalMapsJson?.naverMapsUrl && (
          <div className="mx-1">
            <NaverMapsLink url={externalMapsJson?.naverMapsUrl} />
          </div>
        )}
        {externalMapsJson?.kakaoMapsUrl && (
          <div className="mx-1">
            <KakaoMapsLink url={externalMapsJson?.kakaoMapsUrl} />
          </div>
        )}
      </div>
      <MusicEventListing
        translations={unstable_getTranslations(t)}
        locale={params.locale}
        city={params.city}
        initialMusicEvents={musicEvents}
      />
    </div>
  );
}
