import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { LocalePicker } from "./locale-picker";
import { CityPicker } from "./city-picker";

export const Header = () => {
  // useTranslations is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const t = useTranslations("header");

  return (
    <div className="text-center flex flex-col w-full mb-2 bg-secondary text-black py-2 px-2">
      <div className="flex flex-row items-center">
        <h1 className="text-2xl mb-1 font-bold mr-2">
          <Link href="/">{t("title")}</Link>
        </h1>
        <CityPicker initialCity={t("seoul")} />
      </div>
      <div className="flex flex-row">
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
      <div className="absolute top-1 right-0 pt-2 px-3">
        <LocalePicker />
      </div>
    </div>
  );
};
