import {
  fetchManyMusicArtists,
  fetchMusicArtistBySlug,
  fetchUpcomingMusicEventsForArtist,
} from "@/lib/actions";
import { AppCity, CITIES } from "@/lib/city";
import { AppLocale } from "@/lib/locale";
import { unstable_getTranslations } from "@/lib/translation";
import { MusicArtistInfo } from "@/ui/components/music-artist-info";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { MusicNoteIcon } from "@/ui/svgs/music-note-icon";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateStaticParams = async ({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) => {
  const artists = await fetchManyMusicArtists(locale, {});
  return artists.map((a) => ({
    id: a.slug,
  }));
};

// TODO add translations
export default async function ArtistPage({
  params,
}: {
  params: { id: string; locale: AppLocale; city: AppCity };
}) {
  const artist = await fetchMusicArtistBySlug(params.id);

  if (!artist) notFound();

  const musicEvents = await fetchUpcomingMusicEventsForArtist(artist.id, {});
  const t = await getTranslations("static"); // TODO this is duplicated from the shows page lol

  const translations = unstable_getTranslations(t);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="mr-1">
          <MusicNoteIcon width="20px" />
        </div>

        <h2 className="mb-2">{artist.name}</h2>
      </div>
      <MusicArtistInfo
        artist={artist}
        locale={params.locale}
        translations={translations}
      />
      {/* 
          TODO there is a terrible bug here since MusicEventListing uses the default fetchUpcomingMusicEventsForArtist fn, it wont filter by artist  
          However, since it is unlikely atm that any artist will have 30+ shows lined up, we'll let it be for now lol
      */}
      <MusicEventListing
        initialMusicEvents={musicEvents}
        locale={params.locale}
        city={params.city}
        translations={translations}
      />
    </div>
  );
}
