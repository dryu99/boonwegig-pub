export const toYoutubeSearchLink = (query: string) => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}`;
};

export const toSpotifySearchLink = (query: string) => {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
};
