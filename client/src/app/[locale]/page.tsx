import { fetchUpcomingMusicEvents } from "@/lib/actions";
import { LocaleConfig } from "@/lib/locale";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: { locale: string };
};

// cache fetch results for 1 hour before refetching
export const revalidate = 3600; // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate

export default async function IndexPage({ params: { locale } }: Props) {
  // validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale)) notFound();

  // TODO dig into using this while the page is still dynamic??
  // enable static rendering: https://next-intl-docs.vercel.app/docs/getting-started/app-router#static-rendering
  unstable_setRequestLocale(locale);

  const musicEvents = await fetchUpcomingMusicEvents();
  const t = await getTranslations("static");

  return (
    <div className="flex flex-col">
      <MusicEventListing
        translations={{
          loadMore: t("loadMore"),
          link: t("link"),
          new: t("new"),
          free: t("free"),
          recommended: t("recommended"),
        }}
        locale={locale}
        initialMusicEvents={musicEvents}
      />
    </div>
  );
}
