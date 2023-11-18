import { useTranslations } from "next-intl";
import { CityPicker } from "./city-picker";

export const Header = () => {
  // useTranslations is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const t = useTranslations("header");

  return (
    <div className="text-center">
      <h1 className="text-2xl mt-3 mb-2 font-bold">{t("title")}</h1>
      <CityPicker initialCity={t("seoul")} />
    </div>
  );
};
