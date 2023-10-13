import { Insertable } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent, Venue } from "../db";
import { SavedVenue } from "./venue";

// the music event parsed
export type ParsedMusicEvent = {
  openDateTime?: string; // ISO format
  startDateTime?: string; // ISO format
  earlyPrice?: number;
  doorPrice?: number; // -1 if donation
  eventType?: "concert" | "dj";
  artists?: string[];
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
      parsedEvent.eventType === undefined ||
      parsedEvent.artists === undefined ||
      parsedEvent.artists.length === 0;

    return {
      openDateTime: parsedEvent.openDateTime,
      startDateTime: parsedEvent.startDateTime,
      earlyPrice: parsedEvent.earlyPrice,
      doorPrice: parsedEvent.doorPrice,
      eventType: parsedEvent.eventType,
      venueId: venue.id,
      link: post.link,
      reviewStatus: needsReview ? ReviewStatus.PENDING : ReviewStatus.VALID,
    };
  }
}
