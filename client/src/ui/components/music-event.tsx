import React from "react";
import { ClientMusicEvent, ClientArtist } from "../../lib/database/db-manager";
import * as DateHelper from "@/lib/date.helper";
import { LocationIcon } from "../svgs/location-icon";
import { MusicNoteIcon } from "../svgs/music-note-icon";
import { AppLocale, LocaleToCountryMap } from "@/lib/locale";
import { StaticTranslations } from "@/lib/translation";
import { ThumbsUpIcon } from "../svgs/thumbs-up-icon";
import { MusicGenre, extractKeyGenres, localeToGenreMap } from "@/lib/genre";
import {
  toYoutubeChannelLink,
  toYoutubeSearchLink,
} from "@/lib/external-links";
import { Link } from "@/lib/navigation";
import { InfoIcon } from "../svgs/info-icon";
import { getVenueLocaleName } from "@/lib/venue.helper";
import { NewTag, FreeTag, GenreTag } from "./music-event-tags";

export const MusicEvent = ({
  musicEvent,
  translations,
  locale,
}: {
  musicEvent: ClientMusicEvent;
  translations: StaticTranslations;
  locale: AppLocale;
}) => {
  const dateParts = DateHelper.extractParts(musicEvent.startDateTime, locale);
  const genres = extractKeyGenres(musicEvent.artists, locale);
  return (
    <div className="flex flex-row mb-3">
      {/* Date Section */}
      <div className="mr-3 sm:mr-5 sm:w-32">
        <div className="flex flex-col sm:flex-row">
          <span
            className="mr-2"
            title={musicEvent.startDateTime.toLocaleString()}
          >
            {dateParts.timeStr}
          </span>
          {/* Tag Section */}
          <div className="flex flex-col">
            {DateHelper.isRecent(musicEvent.createdAt) && (
              <NewTag text={translations.new} />
            )}
            {musicEvent.isFree && <FreeTag text={translations.free} />}
            {genres.map((genre, i) => (
              <GenreTag key={i} genre={genre} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        {/* Venue Section */}
        {musicEvent.venue && musicEvent.venue.name && (
          <div className="mr-2 sm:mr-5 sm:w-32">
            <div>
              {/* TODO translate */}
              <div className="inline-block mr-1" title="Venue">
                <LocationIcon width="16px" />
              </div>
              <Link
                href={`/venues/${musicEvent.venue.slug}`}
                className="hover:underline"
                data-umami-event="music-event-venue-link"
              >
                {getVenueLocaleName(musicEvent.venue, locale)}
              </Link>
            </div>
          </div>
        )}

        {/* Artists Section */}
        <div className="sm:mr-5 sm:w-60">
          {/* TODO translate */}
          <div className="inline-block mr-1" title="Artists">
            <MusicNoteIcon />
          </div>
          {musicEvent.artists.map((artist: ClientArtist, i: number) => (
            <React.Fragment key={artist.id}>
              <a
                href={
                  artist.youtubeId
                    ? toYoutubeChannelLink(artist.youtubeId)
                    : toYoutubeSearchLink(artist.name)
                }
                className="hover:underline mr-1"
                data-umami-event="music-event-artist-link"
              >
                {artist.name}
              </a>
              {artist.isRecommended && (
                <span className="inline-block" title={translations.recommended}>
                  <ThumbsUpIcon />
                </span>
              )}

              {i !== musicEvent.artists.length - 1 && <span>, </span>}
            </React.Fragment>
          ))}
        </div>
        {/* Link Section */}
        <div className="flex flex-row">
          <div className="mr-1">
            <InfoIcon />
          </div>

          <Link
            href={`/concerts/${musicEvent.slug}`}
            className="text-sm hover:underline text-secondary"
            data-umami-event="music-event-concert-link"
          >
            {`${translations.moreInfo} >>`}
          </Link>
        </div>
      </div>
    </div>
  );
};
