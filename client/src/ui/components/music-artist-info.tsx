"use client";

import { ClientMusicArtist } from "@/lib/database/db-manager";
import {
  toInstagramProfileLink,
  toSpotifyArtistLink,
  toYoutubeChannelLink,
} from "@/lib/external-links";
import { InstagramIcon } from "../svgs/instagram-icon";
import { YoutubeIcon } from "../svgs/youtube-icon";
import { SpotifyIcon } from "../svgs/spotify-icon";
import { MusicGenre, getLocalizedGenre } from "@/lib/genre";
import { AppLocale } from "@/lib/locale";
import { GenreTag } from "./music-event-tags";
import { StaticTranslations } from "@/lib/translation";

const claimInfoText = (artistName: string, locale: AppLocale) => {
  return locale === "en"
    ? `If you have the link and want to update this page, please contact us on Instagram @boonwegig or email us at boonwegig@gmail.com`
    : `링크가 있고 이 페이지를 업데이트하고 싶으시다면, 인스타그램 @boonwegig 또는 boonwegig@gmail.com으로 연락 주세요.`;
};

// `If you are ${artistName} and would like to claim and edit this page,
// please contact @boonwegig on Instagram via your official Instagram account.`;

// TODO dont do this. use dynamic translations: https://next-intl-docs.vercel.app/docs/usage/messages
const updateYoutubeLinkText = (artistName: string, locale: AppLocale) => {
  return locale === "ko"
    ? `"${artistName}"의 유튜브 채널을 찾을 수 없습니다.`
    : `Could not find Youtube channel for "${artistName}".`;
};

const updateSpotifyLinkText = (artistName: string, locale: AppLocale) => {
  return locale === "ko"
    ? `"${artistName}"의 스포티파이 프로필을 찾을 수 없습니다.`
    : `Could not find Spotify profile for "${artistName}".`;
};

const updateInstagramLinkText = (artistName: string, locale: AppLocale) => {
  return locale === "ko"
    ? `"${artistName}"의 인스타그램 프로필을 찾을 수 없습니다.`
    : `Could not find Instagram profile for "${artistName}".`;
};

export const MusicArtistInfo = ({
  artist,
  locale,
  translations,
}: {
  artist: ClientMusicArtist;
  locale: AppLocale; // TODO can use usePathname to get instead of prop drilling
  translations: StaticTranslations;
}) => {
  return (
    <div>
      <div className="flex flex-row justify-center items-center mb-3">
        <div className="mx-1">
          {artist.instagramUsername ? (
            <a
              href={toInstagramProfileLink(artist.instagramUsername)}
              data-umami-event="music-artist-instagram-link"
            >
              <InstagramIcon />
            </a>
          ) : (
            <div
              className="opacity-30 hover:opacity-100 cursor-pointer"
              onClick={() =>
                alert(
                  `${updateInstagramLinkText(artist.name, locale)}
                
${claimInfoText(artist.name, locale)}`
                )
              }
            >
              <InstagramIcon />
            </div>
          )}
        </div>
        <div className="mx-1">
          {artist.youtubeId ? (
            <a
              href={toYoutubeChannelLink(artist.youtubeId)}
              data-umami-event="music-artist-youtube-link"
            >
              <YoutubeIcon width="40px" />
            </a>
          ) : (
            <div
              className="opacity-30 hover:opacity-100 cursor-pointer"
              onClick={() =>
                alert(
                  `${updateYoutubeLinkText(artist.name, locale)}
                
${claimInfoText(artist.name, locale)}`
                )
              }
            >
              <YoutubeIcon width="40px" />
            </div>
          )}
        </div>
        <div className="mx-1">
          {artist.spotifyId ? (
            <a
              href={toSpotifyArtistLink(artist.spotifyId)}
              data-umami-event="music-artist-spotify-link"
            >
              <SpotifyIcon width="34px" />
            </a>
          ) : (
            <div
              className="opacity-30 hover:opacity-100 cursor-pointer"
              onClick={() =>
                alert(
                  `${updateSpotifyLinkText(artist.name, locale)}
                
${claimInfoText(artist.name, locale)}`
                )
              }
            >
              <SpotifyIcon width="34px" />
            </div>
          )}
        </div>
      </div>
      <div className="text-center mb-5">
        <span className="mr-1">{translations.genre}:</span>

        <GenreTag
          genre={
            artist.genre
              ? getLocalizedGenre(artist.genre as MusicGenre, locale)
              : "N/A"
          }
        />
      </div>
    </div>
  );
};
