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
};

export type NewMusicEvent = Insertable<MusicEvent>;
export type SavedMusicEvent = Selectable<MusicEvent>;

export type NewMusicEventWithArtistNames = NewMusicEvent & {
  artistNames: string[];
};

export class MusicEventModel {
  public static getOneByLink(
    link: string
  ): Promise<SavedMusicEvent | undefined> {
    return DatabaseManager.db
      .selectFrom("musicEvent")
      .where("link", "=", link)
      .selectAll()
      .executeTakeFirst();
  }

  public static addOne(newEvent: NewMusicEvent) {
    return DatabaseManager.db
      .insertInto("musicEvent")
      .values(newEvent)
      .onConflict((oc) => oc.columns(["venueId", "startDateTime"]).doNothing())
      .returning("id")
      .executeTakeFirstOrThrow();
  }

  public static addMany(newEvents: NewMusicEvent[]) {
    return DatabaseManager.db
      .insertInto("musicEvent")
      .values(newEvents)
      .onConflict((oc) => oc.columns(["venueId", "startDateTime"]).doNothing())
      .execute();
  }

  public static toNew(
    parsedEvent: ParsedMusicEvent,
    post: InstagramPost,
    venue: SavedVenue
  ): NewMusicEventWithArtistNames {
    return {
      startDateTime: parsedEvent.startDateTime as string, // TODO not great but the startDateTime SHOULD exist here
      isFree: parsedEvent.isFree,
      artistNames: parsedEvent.artists ?? [],
      eventType: MusicEventType.CONCERT, // TODO implement when necessary
      venueId: venue.id,
      link: post.link,
      reviewStatus: ReviewStatus.VALID, // TODO implement when necessary
    };
  }

  public static isValid(parsedEvent: ParsedMusicEvent): boolean {
    if (
      !parsedEvent.artists ||
      parsedEvent.artists.length === 0 ||
      parsedEvent.artists.length > 10 // this is a decent sign that the event is a clubbing event e.g. https://www.instagram.com/p/CzEMepVL_H2/
    )
      return false;
    if (!parsedEvent.startDateTime) return false;
    return true;
  }
}
