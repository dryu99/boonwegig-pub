import { fetchUpcomingMusicEvents } from "@/lib/actions";
import { AppCity } from "@/lib/city";
import { AppLocale } from "@/lib/locale";
import { unstable_getTranslations } from "@/lib/translation";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { locale: AppLocale; city: AppCity };
};

// note: this page is statically rendered (for now)
//   we opted not to use dynamic rendering since page data really only changes once a day (when we scrape)
//   b/c of this we lose out on dynamic data changes i.e.
//     1. shows still displaying even if the start date has passed
//     2. admin/db changes not being reflected in the UI
//   at the moment we're okay with these given that redeploy every 24 hours minimum
//   (the date tradeoff might even be good given that some users might want to see what happened in the past)
//   (the db changes tradeoff is okay too since admin edits usually happen in bulk and we can insta redeploy)
export default async function CityPage({ params: { locale, city } }: Props) {
  const musicEvents = await fetchUpcomingMusicEvents({
    filter: { includeValidOnly: true, city },
  });
  const t = await getTranslations("static"); // TODO need to rework the way we handle translations lmao we should not be using static

  return (
    <div className="flex flex-col">
      <h2 className="font-bold mb-2">{t("shows")}</h2>
      <MusicEventListing
        translations={unstable_getTranslations(t)}
        locale={locale}
        city={city}
        initialMusicEvents={musicEvents}
      />
    </div>
  );
}
