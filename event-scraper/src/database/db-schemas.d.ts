import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface MusicArtist {
  id: Generated<string>;
  name: string;
  reviewStatus: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  genre: string | null;
  instagramId: string | null;
  youtubeId: string | null;
  spotifyId: string | null;
  country: string | null;
}

export interface MusicEvent {
  id: Generated<string>;
  link: string;
  reviewStatus: string;
  venueId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  startDateTime: Timestamp;
  eventType: string | null;
  isFree: boolean | null;
}

export interface MusicEventArtists {
  eventId: string;
  artistId: string;
}

export interface Venue {
  id: Generated<string>;
  instagramId: string;
  reviewStatus: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  name: string | null;
  address: string | null;
  city: string;
  country: string;
}

export interface DB {
  musicArtist: MusicArtist;
  musicEvent: MusicEvent;
  musicEventArtists: MusicEventArtists;
  venue: Venue;
}
