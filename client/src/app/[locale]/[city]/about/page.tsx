import { AppCity } from "@/lib/city";
import { AppLocale } from "@/lib/locale";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: { locale: AppLocale; city: AppCity };
}) {
  // TODO do we need this here? why dont other pages need it? sth breaks during static page build step
  unstable_setRequestLocale(params.locale);

  const t = await getTranslations("AboutPage");

  return (
    <div>
      <h2 className="font-bold mb-2">{t("about")}</h2>
      <p className="text-center mb-5 max-w-prose">{t("bio")}</p>
      <p className="text-center mb-5 max-w-prose">{t("nameBlurb")}</p>
      <p className="text-center max-w-prose">{t("contactBlurb")}</p>
    </div>
  );
}
