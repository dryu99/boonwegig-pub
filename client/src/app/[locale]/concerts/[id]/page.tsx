import { fetchMusicEventBySlug } from "@/lib/actions";
import * as DateHelper from "@/lib/date.helper";
import { toInstagramProfileLink } from "@/lib/external-links";
import { extractKeyGenres } from "@/lib/genre";
import { AppLocale } from "@/lib/locale";
import { Link } from "@/lib/navigation";
import { getVenueLocaleName } from "@/lib/venue.helper";
import {
  GoogleMapsLink,
  NaverMapsLink,
  KakaoMapsLink,
} from "@/ui/components/external-maps-link";
import { NewTag, FreeTag, GenreTag } from "@/ui/components/music-event-tags";
import { InstagramIcon } from "@/ui/svgs/instagram-icon";
import { LocationIcon } from "@/ui/svgs/location-icon";
import { ThumbsUpIcon } from "@/ui/svgs/thumbs-up-icon";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

// TODO add translations
export default async function ConcertPage({
  params,
}: {
  params: { id: string; locale: AppLocale };
}) {
  const musicEvent = await fetchMusicEventBySlug(params.id);

  if (!musicEvent) notFound();

  const t = await getTranslations("static"); // TODO this is duplicated from the shows page lol
  const genres = extractKeyGenres(musicEvent.artists, params.locale);
  const venue = musicEvent.venue;
  const dateParts = DateHelper.extractParts(
    musicEvent.startDateTime,
    params.locale
  );

  const isRecent = DateHelper.isRecent(musicEvent.createdAt);
  const showTags = isRecent || musicEvent.isFree || genres.length > 0;

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl mb-1">
        <span
          className={`mr-2 ${params.locale === "ko" ? "text-2xl" : ""}`}
        >{`${dateParts.dayOfWeek}`}</span>
        <span className="mr-2">{`${dateParts.dateStr}`}</span>
        <span className="mr-2">-</span>
        <span>{`${dateParts.timeStr}`}</span>
      </h2>
      {venue && (
        <>
          <div className="text-center text-xl mb-2">
            <div className="inline-block mr-1" title="Venue">
              <LocationIcon width="16px" />
            </div>
            <Link className="hover:underline" href={`/venues/${venue?.slug}`}>
              {getVenueLocaleName(venue, params.locale)}
            </Link>
          </div>
          <div className="flex flex-row justify-center mb-5">
            {venue.externalMapsJson?.googleMapsUrl && (
              <div className="mx-1">
                <GoogleMapsLink url={venue.externalMapsJson?.googleMapsUrl} />
              </div>
            )}
            {venue.externalMapsJson?.naverMapsUrl && (
              <div className="mx-1">
                <NaverMapsLink url={venue.externalMapsJson?.naverMapsUrl} />
              </div>
            )}
            {venue.externalMapsJson?.kakaoMapsUrl && (
              <div className="mx-1">
                <KakaoMapsLink url={venue.externalMapsJson?.kakaoMapsUrl} />
              </div>
            )}
          </div>
        </>
      )}

      <div className="text-center mb-5">
        <h3 className="font-bold">{t("lineup")}</h3>
        <hr className="w-20 mx-auto mb-1" />
        <div>
          {musicEvent.artists.map((a) => (
            <div key={a.id}>
              <span className="mr-1">{a.name}</span>
              {a.isRecommended && (
                <span className="inline-block" title={t("recommended")}>
                  <ThumbsUpIcon />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-5">
        <h3 className="font-bold">{t("details")}</h3>
        <hr className="w-20 mx-auto mb-2" />
        <div className="flex justify-center">
          <a href={musicEvent.link} data-umami-event="concert-external-link">
            <InstagramIcon />
          </a>
        </div>
      </div>
      {showTags && (
        <div className="text-center">
          <h3 className="font-bold">{t("tags")}</h3>
          <hr className="w-20 mx-auto mb-1" />
          <div className="flex flex-col">
            {isRecent && <NewTag text={t("new")} />}
            {musicEvent.isFree && <FreeTag text={t("free")} />}
            {genres.map((genre, i) => (
              <GenreTag key={i} genre={genre} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
