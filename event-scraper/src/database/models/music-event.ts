import { Insertable, Selectable } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent, Venue } from "../db-schemas";
import { SavedVenue } from "./venue";
import { DatabaseManager } from "../db-manager";
import { SavedMusicArtist } from "./music-artist";

export enum MusicEventType {
  CLASSICAL = "CLASSICAL",
  DJ = "DJ",
  CONCERT = "CONCERT",
}

// the music event parsed
export type ParsedMusicEvent = {
  startDateTime?: string; // ISO
  isFree?: boolean;
  artists?: string[];
  locationName?: string; // not address
};

export type NewMusicEvent = Insertable<MusicEvent>;
export type SavedMusicEvent = Selectable<MusicEvent>;

export type NewMusicEventWithArtistNames = NewMusicEvent & {
  artistNames: string[];
};

export class MusicEventModel {
  public static addOne(newEvent: NewMusicEvent) {
    return DatabaseManager.db
      .insertInto("musicEvent")
      .values(newEvent)
      .onConflict((oc) =>
        oc.columns(["venueId", "startDateTime", "locationName"]).doNothing()
      )
      .returning("id")
      .executeTakeFirstOrThrow();
  }

  public static addMany(newEvents: NewMusicEvent[]) {
    return DatabaseManager.db
      .insertInto("musicEvent")
      .values(newEvents)
      .onConflict((oc) =>
        oc.columns(["venueId", "startDateTime", "locationName"]).doNothing()
      )
      .execute();
  }

  public static toNew(
    parsedEvent: ParsedMusicEvent,
    post: InstagramPost,
    venue: SavedVenue
  ): NewMusicEventWithArtistNames {
    const needsReview =
      parsedEvent.startDateTime === undefined ||
      parsedEvent.artists === undefined ||
      parsedEvent.artists.length === 0;

    return {
      startDateTime: parsedEvent.startDateTime,
      isFree: parsedEvent.isFree,
      locationName: parsedEvent.locationName,
      artistNames: parsedEvent.artists ?? [],
      eventType: MusicEventType.CONCERT,
      venueId: venue.id,
      link: post.link,
      reviewStatus: needsReview ? ReviewStatus.PENDING : ReviewStatus.VALID,
    };
  }
}
