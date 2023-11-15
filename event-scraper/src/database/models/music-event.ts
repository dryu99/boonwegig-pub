import { Insertable, Selectable, sql } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent, Venue } from "../db-schemas";
import { SavedVenue } from "./venue";
import { DatabaseManager } from "../db-manager";
import { SavedMusicArtist } from "./music-artist";
import { TimezoneOffsets } from "../../utils/time";
import { AppError } from "../../utils/error";

export enum MusicEventType {
  CLASSICAL = "CLASSICAL",
  DJ = "DJ",
  CONCERT = "CONCERT",
}

// the music event parsed
export type ParsedMusicEvent = {
  startDateTime?: string; // ISO
  isFree?: boolean;
  musicArtists?: string[];
  eventType?: MusicEventType;
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
    parsedEvent: ParsedMusicEvent, // INVARIANT: assume parsedEvent is valid (since we should've validated beforehand)
    post: InstagramPost,
    venue: SavedVenue
  ): NewMusicEventWithArtistNames {
    const timezoneOffset = TimezoneOffsets[venue.city.toLowerCase()];
    const inferredStartDateStr = this.inferStartDate(
      parsedEvent.startDateTime!,
      post.createdAt
    );

    return {
      startDateTime: inferredStartDateStr + timezoneOffset,
      isFree: parsedEvent.isFree,
      artistNames: parsedEvent.musicArtists ?? [],
      eventType: parsedEvent.eventType,
      venueId: venue.id,
      link: post.link,
      reviewStatus: ReviewStatus.VALID, // TODO implement when necessary
    };
  }

  public static validateParsed(parsedEvent: ParsedMusicEvent): void {
    if (
      !parsedEvent.musicArtists ||
      parsedEvent.musicArtists.length === 0 ||
      parsedEvent.musicArtists.length > 10 // this is a decent sign that the event is a clubbing event e.g. https://www.instagram.com/p/CzEMepVL_H2/
    )
      throw new AppError("Event has invalid music artists", { parsedEvent });

    if (
      !parsedEvent.startDateTime ||
      parsedEvent.startDateTime === "null" || // sometimes chatgpt returns back "null" string instead of null value
      parsedEvent.startDateTime.endsWith("Z") // we aren't handling this case rn
    )
      throw new AppError("Event has invalid start date time", { parsedEvent });
  }

  private static inferStartDate(
    // TODO maybe rename to startDate in db lol
    // TODO also maybe we should type eventStartDate as Date in ParsedMusicEvent instead of string
    eventStartDateStr: string,
    postDate: Date
  ): string {
    const eventStartDate = new Date(eventStartDateStr);
    if (eventStartDate >= postDate) return eventStartDateStr;

    const inferredEventStartDate = new Date(eventStartDate);
    const postYear = postDate.getUTCFullYear();
    inferredEventStartDate.setUTCFullYear(postYear);

    const inferredEventStartYear = inferredEventStartDate.getUTCFullYear();
    const inferredEventStartDateStr =
      inferredEventStartYear + eventStartDateStr.substring(4); // TODO this is def a lil hacky, if we ever invest in a date library rewrite this fn

    return inferredEventStartDateStr;
  }
}
