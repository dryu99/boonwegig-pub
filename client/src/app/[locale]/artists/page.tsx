import { fetchManyMusicArtists, fetchManyVenues } from "@/lib/actions";
import { AppLocale } from "@/lib/locale";
import { Link, redirect } from "@/lib/navigation";
import { getLocalizedVenueName } from "@/lib/venue.helper";
import { courier } from "@/ui/fonts";
import { getTranslations } from "next-intl/server";

// TODO implement pagination
export default async function ArtistsPage({
  params,
}: {
  params: { locale: AppLocale };
}) {
  // this page should not filter by city since artists won't necessarily have their cities set
  let artists = await fetchManyMusicArtists(params.locale, {});

  const t = await getTranslations("ArtistsPage");

  return (
    <div className="w-full self-start">
      <h2 className="font-bold">{t("artists")}</h2>
      <div>
        {artists.map((artist, i) => (
          <div key={artist.id}>
            <span className={`${courier.className}`}>
              {(i + 1).toString().padStart(2, "0")}.
            </span>{" "}
            <Link className="hover:underline" href={`/artists/${artist.slug}`}>
              {artist.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
