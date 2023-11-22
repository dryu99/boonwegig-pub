import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { LocalePicker } from "./locale-picker";

export const Header = () => {
  // useTranslations is a hook but should be smart enough to choose between server vs static rendering: https://next-intl-docs.vercel.app/docs/environments/server-client-components
  const t = useTranslations("header");

  return (
    <div className="text-center">
      <div className="absolute top-0 right-0 pt-2 px-3">
        <LocalePicker />
      </div>
      <h1 className="text-2xl mt-3 mb-2 font-bold">
        <Link href="/">{t("title")}</Link>
      </h1>
    </div>
  );
};
