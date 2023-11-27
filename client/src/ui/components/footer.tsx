import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <div className="text-center text-sm mt-10 mb-4 flex flex-col items-center">
      <div className="w-[50em] text-secondary mb-2">{t("note")}</div>
      <div>© 2023 BoonWeGig</div>
      <div>contact: boonwegig@gmail.com</div>
    </div>
  );
};
