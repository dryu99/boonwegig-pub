import React from "react";
import {
  ClientMusicEvent,
  ClientMusicArtist,
} from "../../lib/database/db-manager";
import * as DateHelper from "@/lib/date.helper";
import { LocationIcon } from "../svgs/location-icon";
import { MusicNoteIcon } from "../svgs/music-note-icon";
import { AppLocale } from "@/lib/locale";
import { StaticTranslations } from "@/lib/translation";
import { ThumbsUpIcon } from "../svgs/thumbs-up-icon";
import { extractKeyGenres } from "@/lib/genre";
import { Link } from "@/lib/navigation";
import { InfoIcon } from "../svgs/info-icon";
import { getLocalizedVenueName } from "@/lib/venue.helper";
import { NewTag, FreeTag, GenreTag } from "./music-event-tags";
import { courier } from "../fonts";

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
      <div className={`mr-3 sm:mr-5 sm:w-32`}>
        <div className="flex flex-col sm:flex-row">
          <span
            className={`mr-2 ${courier.className}`}
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
                {getLocalizedVenueName(musicEvent.venue, locale)}
              </Link>
            </div>
          </div>
        )}

        {/* Artists Section */}
        <div className="sm:mr-5 sm:w-60">
          {/* TODO translate */}
          <div className="inline-block mr-1" title="Artists">
            <MusicNoteIcon width="16px" />
          </div>
          {musicEvent.artists.map((artist: ClientMusicArtist, i: number) => (
            <React.Fragment key={artist.id}>
              <Link
                href={`/artists/${artist.slug}`}
                className="hover:underline mr-1"
                data-umami-event="music-event-artist-link"
              >
                {artist.name}
              </Link>
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
            href={`/shows/${musicEvent.slug}`}
            className="text-sm hover:underline text-secondary"
            data-umami-event="music-event-show-link"
          >
            {`${translations.moreInfo} >>`}
          </Link>
        </div>
      </div>
    </div>
  );
};
