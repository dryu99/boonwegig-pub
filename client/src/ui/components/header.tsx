import { useTranslations } from "next-intl";
import { CityPicker } from "./city-picker";
import { Link } from "@/lib/navigation";

export const Header = () => {
  // useTranslations is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const t = useTranslations("header");

  return (
    <div className="text-center">
      <div className="absolute top-0 right-0 p-2">
        <Link
          className="hover:underline"
          data-umami-event="en-locale-link"
          href="/"
          locale="en"
        >
          ENG
        </Link>
        <span className="mx-1">|</span>
        <Link
          className="text-sm hover:underline"
          data-umami-event="ko-locale-link"
          href="/"
          locale="ko"
        >
          한국어
        </Link>
      </div>
      <h1 className="text-2xl mt-3 mb-2 font-bold">{t("title")}</h1>
      <CityPicker initialCity={t("seoul")} />
    </div>
  );
};
