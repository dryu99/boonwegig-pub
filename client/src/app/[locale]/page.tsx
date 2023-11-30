import { CITIES } from "@/lib/city";
import { AppLocale, LocaleConfig } from "@/lib/locale";
import { CityOption } from "@/ui/components/city-option";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function IndexPage({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) {
  // validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale)) notFound();

  // TODO dig into using this while the page is still dynamic??
  // enable static rendering: https://next-intl-docs.vercel.app/docs/getting-started/app-router#static-rendering
  unstable_setRequestLocale(locale);

  const t = await getTranslations("IndexPage");

  return (
    <div className="flex flex-col items-center">
      <h2>{t("chooseCity")}</h2>
      <div className="flex flex-row">
        {CITIES.map((city) => (
          <CityOption
            key={city}
            city={city}
            displayText={t(city.toLowerCase())}
          />
        ))}
      </div>
    </div>
  );
}
