import { Insertable } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent, Venue } from "../db";
import { SavedVenue } from "./venue";

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

export class MusicEventModel {
  public static toNewMusicEvent(
    parsedEvent: ParsedMusicEvent,
    post: InstagramPost,
    venue: SavedVenue
  ): NewMusicEvent {
    const needsReview =
      parsedEvent.startDateTime === undefined ||
      parsedEvent.artists === undefined ||
      parsedEvent.artists.length === 0;

    return {
      startDateTime: parsedEvent.startDateTime,
      isFree: parsedEvent.isFree,
      locationName: parsedEvent.locationName,
      eventType: MusicEventType.CONCERT,
      venueId: venue.id,
      link: post.link,
      reviewStatus: needsReview ? ReviewStatus.PENDING : ReviewStatus.VALID,
    };
  }
}
