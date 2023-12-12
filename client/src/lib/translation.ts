// TODO this isn't great but i dont know how to get static translations working without prop drilling
// TODO theres a lot of duplicated translations in the json message files try making things more dynamic

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

export type HeaderTranslations = {
  title: string;
  shows: string;
  venues: string;
  artists: string;
  about: string;

  // TODO we can do better than this lol can prob use dynamic translations somewhow
  seoul: string;
  busan: string;
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

export const unstable_getHeaderTranslations = (t: any): HeaderTranslations => {
  return {
    title: t("title"),
    shows: t("shows"),
    venues: t("venues"),
    artists: t("artists"),
    about: t("about"),
    seoul: t("seoul"),
    busan: t("busan"),
  };
};
