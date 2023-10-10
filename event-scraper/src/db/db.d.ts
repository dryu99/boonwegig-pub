import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, string | number, string | number>;

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
}

export interface MusicEvent {
  id: Generated<string>;
  link: string;
  reviewStatus: string;
  venueId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  openDateTime: Timestamp | null;
  startDateTime: Timestamp | null;
  earlyPrice: Numeric | null;
  doorPrice: Numeric | null;
  eventType: string | null;
}

export interface MusicEventArtists {
  eventId: string;
  artistId: string;
}

export interface Venue {
  id: Generated<string>;
  instagramId: string;
  reviewStatus: string;
  city: string;
  country: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  name: string | null;
  address: string | null;
}

export interface DB {
  musicArtist: MusicArtist;
  musicEvent: MusicEvent;
  musicEventArtists: MusicEventArtists;
  venue: Venue;
}
