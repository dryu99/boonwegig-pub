import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface MusicArtist {
  country: string | null;
  createdAt: Generated<Timestamp>;
  genre: string | null;
  id: Generated<string>;
  instagramId: string | null;
  instagramUsername: string | null;
  isRecommended: Generated<boolean>;
  name: string;
  recommendedLinks: string[] | null;
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
  venueId: string | null;
}

export interface MusicEventArtists {
  artistId: string;
  eventId: string;
}

export interface Venue {
  businessAddressJson: Json | null;
  businessEmail: string | null;
  businessPhoneNumber: string | null;
  city: string;
  country: string;
  createdAt: Generated<Timestamp>;
  externalLink: string | null;
  id: Generated<string>;
  instagramId: string | null;
  instagramUsername: string;
  localName: string | null;
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
