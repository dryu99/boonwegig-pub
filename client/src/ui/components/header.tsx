import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { LocalePicker } from "./locale-picker";
import { CityPicker } from "./city-picker";
import { AppLocale } from "@/lib/locale";
import clsx from "clsx";

export const Header = ({ locale }: { locale: AppLocale }) => {
  // useTranslations is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const t = useTranslations("header");

  return (
    <div className="flex flex-row justify-between text-center w-full mb-2 bg-secondary text-black py-2 px-3 sm:px-8">
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <h1 className="text-2xl mb-1 font-bold mr-2">
            <Link href="/">{t("title")}</Link>
          </h1>
          <CityPicker initialCity={t("seoul")} />
        </div>
        <div
          className={clsx("flex flex-row", {
            "text-sm pb-1": locale === "ko",
          })}
        >
          <Link
            className="mr-2 hover:underline"
            href="/"
            data-umami-event="header-shows-link"
          >
            {t("shows")}/
          </Link>
          <Link
            className="mr-2 hover:underline"
            href="/venues/"
            data-umami-event="header-venues-link"
          >
            {t("venues")}/
          </Link>
          <Link
            className="mr-2 hover:underline"
            href="/artists/"
            data-umami-event="header-artists-link"
          >
            {t("artists")}/
          </Link>
        </div>
      </div>
      <div className="pt-[5px]">
        <LocalePicker />
      </div>
    </div>
  );
};
