// TODO this isn't great but i dont know how to get static translations working without prop drilling

export type StaticTranslations = {
  loadMore: string;
  link: string;
  free: string;
  new: string;
  recommended: string;
  moreInfo: string;
  details: string;
  lineup: string;

  // TODO these can be separated for artist component
  genre: string;
};
// TODO this is terribad remove once you firugre out how to call hooks in child components
export const unstable_getTranslations = (t: any): StaticTranslations => {
  return {
    loadMore: t("loadMore"),
    link: t("link"),
    new: t("new"),
    free: t("free"),
    recommended: t("recommended"),
    moreInfo: t("moreInfo"),
    details: t("details"),
    lineup: t("lineup"),
    genre: t("genre"),
  };
};
