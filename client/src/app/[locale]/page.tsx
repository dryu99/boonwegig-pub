import { fetchMusicEvents } from "@/lib/actions";
import { LocaleConfig } from "@/lib/locale";
import { MusicEventListing } from "@/ui/components/music-event-listing";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: { locale: string };
};

export default async function IndexPage({ params: { locale } }: Props) {
  // validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale)) notFound();

  // enable static rendering: https://next-intl-docs.vercel.app/docs/getting-started/app-router#static-rendering
  unstable_setRequestLocale(locale);

  const musicEvents = await fetchMusicEvents();
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
