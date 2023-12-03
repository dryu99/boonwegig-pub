import { fetchManyMusicArtists } from "@/lib/actions";
import { AppCity } from "@/lib/city";
import { AppLocale } from "@/lib/locale";
import { Link } from "@/lib/navigation";
import { courier } from "@/ui/fonts";
import { getTranslations } from "next-intl/server";

// TODO implement pagination
export default async function ArtistsPage({
  params,
}: {
  params: { locale: AppLocale; city: AppCity };
}) {
  // this page should not filter by city since artists won't necessarily have their cities set
  let artists = await fetchManyMusicArtists(params.locale, {});

  const t = await getTranslations("ArtistsPage");

  return (
    <div className="w-full self-start">
      <h2 className="font-bold mb-2">{t("artists")}</h2>
      <div>
        {artists.map((artist, i) => (
          <div key={artist.id}>
            <span className={`${courier.className}`}>
              {(i + 1).toString().padStart(2, "0")}.
            </span>{" "}
            <Link
              className="hover:underline"
              // TODO maybe route should just be /artists since we don't really track artists by city atm...
              //      deal with this later
              href={`/${params.city}/artists/${artist.slug}`}
            >
              {artist.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
