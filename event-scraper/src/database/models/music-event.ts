import { Insertable, Selectable, sql } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus, UUID } from "../../utils/types";
import { MusicEvent, MusicEventArtists, Venue } from "../db-schemas";
import { SavedVenue } from "./venue";
import { DatabaseManager } from "../db-manager";
import {
  MusicArtistModel,
  NewMusicArtist,
  SavedMusicArtist,
} from "./music-artist";
import { TimezoneOffsets } from "../../utils/time";
import { AppError } from "../../utils/error";
import { v4 as uuidv4 } from "uuid";

export enum MusicEventType {
  CLASSICAL = "CLASSICAL", // TODO remove
  DJ = "DJ", // TODO remove
  CONCERT = "CONCERT",
  // TODO insert
  // FESTIVAL
  // CLUB?
}

// the music event parsed
export type ParsedMusicEvent = {
  startDateTime?: string; // ISO
  isFree?: boolean;
  musicArtists?: string[];
  eventType?: MusicEventType;
};

export type NewMusicEvent = Insertable<MusicEvent> & {
  id: UUID; // ids don't have to exist on new music models (since they're generated) but with the current slug setup they do
};
export type SavedMusicEvent = Selectable<MusicEvent>;
export type SavedMusicEventArtists = Selectable<MusicEventArtists>;

export type NewMusicEventWithArtists = NewMusicEvent & {
  id: UUID;
  artists: NewMusicArtist[];
};

export class MusicEventModel {
  public static getOneById(id: UUID): Promise<SavedMusicEvent | undefined> {
    return DatabaseManager.db
      .selectFrom("musicEvent")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  public static getOneByLink(
    link: string
  ): Promise<SavedMusicEvent | undefined> {
    return DatabaseManager.db
      .selectFrom("musicEvent")
      .where("link", "=", link)
      .selectAll()
      .executeTakeFirst();
  }

  public static addOne(
    newEvent: NewMusicEvent
  ): Promise<Pick<SavedMusicEvent, "id"> | undefined> {
    return DatabaseManager.db
      .insertInto("musicEvent")
      .values(newEvent)
      .returning("id")
      .executeTakeFirstOrThrow();
  }

  public static async addOneWithArtists(
    newEvent: NewMusicEventWithArtists
  ): Promise<{
    savedMusicEvent: Pick<SavedMusicEvent, "id" | "link">;
    savedArtists: Pick<SavedMusicArtist, "id" | "name">[];
    savedMusicEventArtists: SavedMusicEventArtists[];
  }> {
    let newArtists = newEvent.artists;

    // TODO a lil wack that we have to do this, but db doesn't like unexpected fields
    // @ts-ignore
    delete newEvent.artists;

    // use transaction since this operation should be atomic
    return DatabaseManager.db.transaction().execute(async (trx) => {
      const savedMusicEvent = await trx
        .insertInto("musicEvent")
        .values(newEvent)
        .returning(["id", "link"])
        .executeTakeFirstOrThrow();

      // TODO would be nice if we could do this in the INSERT INTO query with ON CONSTRAINT, but seems like we need an index...
      // check for existing artists (i.e. same name)
      const existingArtists = await trx
        .selectFrom("musicArtist")
        .select(["name", "id"])
        .where(
          sql`LOWER(music_artist.name)`,
          "in",
          newArtists.map((a) => a.name.toLowerCase())
        )
        .execute();

      const existingArtistNames = new Set(
        existingArtists.map((artist) => artist.name.toLowerCase())
      );

      const filteredNewArtists = newArtists.filter(
        (newArtist) => !existingArtistNames.has(newArtist.name.toLowerCase())
      );

      // insert new artists (that don't already exist)
      const savedArtists = await trx
        .insertInto("musicArtist")
        .values(filteredNewArtists)
        // note: right now this conflict should never occur given the lowercase check above but we'll keep here just cause :P
        .onConflict((oc) => oc.columns(["name"]).doNothing())
        // TODO can only have one onConflict clause... should be fine since insta id isn't being added in our curr workflow, but worth digging into
        // .onConflict((oc) => oc.column("instagramId").doNothing())
        .returning(["id", "name"])
        .execute();

      // save event-artist pairs by compiling all artist ids associated with event (existing + saved)
      const allSavedArtistIds = existingArtists
        .map((a) => a.id)
        .concat(savedArtists.map((a) => a.id));

      const newEventArtistPairs = allSavedArtistIds.map((savedArtistId) => ({
        artistId: savedArtistId,
        eventId: savedMusicEvent.id,
      }));

      const savedMusicEventArtists = await trx
        .insertInto("musicEventArtists")
        .values(newEventArtistPairs)
        .returning(["artistId", "eventId"])
        .execute();

      return {
        savedMusicEvent,
        savedArtists,
        savedMusicEventArtists,
      };
    });
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
  ): NewMusicEventWithArtists {
    const timezoneOffset = TimezoneOffsets[venue.city.toLowerCase()];
    const inferredStartDateStr = this.inferStartDate(
      parsedEvent.startDateTime!,
      post.createdAt
    );

    const newId = uuidv4();

    return {
      id: newId,
      startDateTime: inferredStartDateStr + timezoneOffset,
      isFree: parsedEvent.isFree,
      artists: parsedEvent.musicArtists
        ? parsedEvent.musicArtists.map((artistName) =>
            MusicArtistModel.toNew(artistName)
          )
        : [],
      // TODO i think this is correct. DJ and CLASSICAL should really go into genre for artist. but we won't touch chatgpt prompt until we dig more into that later
      eventType: MusicEventType.CONCERT,
      venueId: venue.id,
      link: post.link.trim(),
      reviewStatus: ReviewStatus.PENDING,
      slug: this.generateSlug(venue.slug, newId),
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

  private static generateSlug(venueSlug: string, id: UUID) {
    const idFirstSegment = id.split("-")[0];
    return `${venueSlug}-${idFirstSegment}`;
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
