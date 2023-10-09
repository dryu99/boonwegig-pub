import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface MusicArtist {
  id: Generated<string>;
  name: string;
  review_status: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  genre: string | null;
  instagram_id: string | null;
  youtube_id: string | null;
  spotify_id: string | null;
}

export interface MusicEvent {
  id: Generated<string>;
  link: string;
  country: string;
  city: string;
  review_status: string;
  venue_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  open_date_time: Timestamp | null;
  start_date_time: Timestamp | null;
  early_price: Numeric | null;
  door_price: Numeric | null;
  event_type: string | null;
}

export interface MusicEventArtists {
  event_id: string;
  artist_id: string;
}

export interface Venue {
  id: Generated<string>;
  instagram_id: string;
  review_status: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  name: string | null;
  address: string | null;
}

export interface DB {
  music_artist: MusicArtist;
  music_event: MusicEvent;
  music_event_artists: MusicEventArtists;
  venue: Venue;
}
