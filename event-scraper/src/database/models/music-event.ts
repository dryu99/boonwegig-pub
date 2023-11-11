import { Insertable, Selectable, sql } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent, Venue } from "../db-schemas";
import { SavedVenue } from "./venue";
import { DatabaseManager } from "../db-manager";
import { SavedMusicArtist } from "./music-artist";
import { TimezoneOffsets } from "../../utils/timezone";
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
    const validStartDate = !parsedEvent.startDateTime!.endsWith("Z")
      ? new Date(parsedEvent.startDateTime! + "Z")
      : new Date(parsedEvent.startDateTime!);
    const timezoneOffset = TimezoneOffsets[venue.city.toLowerCase()];
    const inferredStartDate = this.inferStartDate(
      validStartDate,
      post.timestamp
    );

    return {
      startDateTime: inferredStartDate.toISOString() + timezoneOffset,
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
      parsedEvent.startDateTime === "null" // sometimes chatgpt returns back "null" string instead of null value
    )
      throw new AppError("Event has invalid start date time", { parsedEvent });
  }

  private static inferStartDate(
    // TODO maybe rename to startDate in db lol
    // TODO also maybe we should type eventStartDate as Date in ParsedMusicEvent instead of string
    eventStartDate: Date,
    postDate: Date
  ): Date {
    if (eventStartDate >= postDate) return eventStartDate;

    // post date = 12-01-2023
    // 1. event date = 12-02-2019
    //    try setting year first: 12-02-2023 > 12-01-2023 so valid
    // 2. event date = 11-30-2019
    //    try setting year first: 11-30-2023 < 12-01-2023 so still invalid
    //    now try year +1: 11-30-2024 > 12-01-2023 so valid
    const inferredEventStartDate = new Date(eventStartDate);
    const postYear = postDate.getUTCFullYear();
    inferredEventStartDate.setUTCFullYear(postYear);
    if (inferredEventStartDate < postDate) {
      inferredEventStartDate.setUTCFullYear(postYear + 1);
    }

    return inferredEventStartDate;
  }
}
