export const toYoutubeSearchLink = (query: string) => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    query
  )}`;
};

export const toYoutubeChannelLink = (channelId: string) => {
  return channelId.startsWith("@")
    ? `https://www.youtube.com/${channelId}`
    : `https://www.youtube.com/channel/${channelId}`;
};

export const toSpotifySearchLink = (query: string) => {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
};

export const toSpotifyArtistLink = (spotifyId: string) => {
  return `https://open.spotify.com/artist/${spotifyId}`;
};

export const toInstagramProfileLink = (username: string) => {
  return `https://www.instagram.com/${username}`;
};

export const toGoogleSearchLink = (query: string) => {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};
