import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface MusicArtist {
  country: string | null;
  createdAt: Generated<Timestamp>;
  genre: string | null;
  id: Generated<string>;
  instagramId: string | null;
  name: string;
  reviewStatus: string;
  spotifyId: string | null;
  updatedAt: Generated<Timestamp>;
  youtubeId: string | null;
}

export interface MusicEvent {
  createdAt: Generated<Timestamp>;
  eventType: string | null;
  id: Generated<string>;
  isFree: boolean | null;
  link: string;
  reviewStatus: string;
  startDateTime: Timestamp;
  updatedAt: Generated<Timestamp>;
  venueId: string;
}

export interface MusicEventArtists {
  artistId: string;
  eventId: string;
}

export interface Venue {
  address: string | null;
  city: string;
  country: string;
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  instagramId: string;
  name: string | null;
  reviewStatus: string;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  musicArtist: MusicArtist;
  musicEvent: MusicEvent;
  musicEventArtists: MusicEventArtists;
  venue: Venue;
}
