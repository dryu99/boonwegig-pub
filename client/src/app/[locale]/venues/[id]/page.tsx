import { fetchUpcomingMusicEvents, fetchVenueBySlug } from "@/lib/actions";
import { toInstagramProfileLink } from "@/lib/external-links";
import { LocaleToCountryMap } from "@/lib/locale";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { InstagramIcon } from "@/ui/svgs/instagram-icon";
import { LocationIcon } from "@/ui/svgs/location-icon";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function VenuePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const venue = await fetchVenueBySlug(params.id);

  if (!venue) notFound();

  const externalMapsJson = venue.externalMapsJson;

  // TODO feels kind of bad to do 2 queries, we can prob do 1 in the fetch venue by slug
  //      OR if we want to super optimize, we can make the fetch venue by slug query really simple (only fetch id column)
  //         and after confirming existence we can render page using some suspense magic while the music events are waiting to be fetched
  //      OR we could just do 1 query lol
  const musicEvents = await fetchUpcomingMusicEvents({
    offset: 0,
    filter: { venueId: venue.id },
  });

  const t = await getTranslations("static"); // TODO this is duplicated from the shows page lol

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="mr-1">
          <LocationIcon width="20px" />
        </div>

        <h2>
          {LocaleToCountryMap[params.locale].includes(venue.country) &&
          venue.localName
            ? venue.localName
            : venue.name}
        </h2>
      </div>
      <div className="flex flex-row justify-center mb-5">
        <a
          className="mx-1"
          href={toInstagramProfileLink(venue.instagramUsername)}
        >
          <InstagramIcon />
        </a>
        {externalMapsJson?.googleMapsUrl && (
          <a
            className="mx-1"
            href={externalMapsJson?.googleMapsUrl}
            data-umami-event="google-maps-link"
          >
            <Image
              src="/icons/google-maps.png"
              alt="Google Maps Icon"
              width={36}
              height={36}
            />
          </a>
        )}
        {externalMapsJson?.naverMapsUrl && (
          <a
            className="mx-1"
            href={externalMapsJson?.naverMapsUrl}
            data-umami-event="naver-maps-link"
          >
            <Image
              src="/icons/naver-maps.png"
              alt="Naver Maps Icon"
              width={36}
              height={36}
              className="rounded"
            />
          </a>
        )}
        {externalMapsJson?.kakaoMapsUrl && (
          <a
            className="mx-1"
            href={externalMapsJson?.kakaoMapsUrl}
            data-umami-event="kakao-maps-link"
          >
            <Image
              src="/icons/kakao-maps.png"
              alt="Kakao Maps Icon"
              width={36}
              height={36}
              className="rounded"
            />
          </a>
        )}
      </div>
      <MusicEventListing
        translations={{
          loadMore: t("loadMore"),
          link: t("link"),
          new: t("new"),
          free: t("free"),
          recommended: t("recommended"),
        }}
        locale={params.locale}
        initialMusicEvents={musicEvents}
      />
    </div>
  );
}
