import { AppCity } from "@/lib/city";
import { AppLocale } from "@/lib/locale";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: { locale: AppLocale; city: AppCity };
}) {
  unstable_setRequestLocale(params.locale);

  const t = await getTranslations("AboutPage");

  return (
    <div>
      <h2 className="font-bold mb-2">{t("about")}</h2>
      <p className="text-center mb-5">{t("bio")}</p>
      <p className="text-center mb-5">{t("nameBlurb")}</p>
      <p className="text-center">{t("contactBlurb")}</p>
    </div>
  );
}
