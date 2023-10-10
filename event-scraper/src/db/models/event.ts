import { Insertable } from "kysely";
import { InstagramPost } from "../../services/instagram.service";
import { ReviewStatus } from "../../utils/types";
import { MusicEvent } from "../db";

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

export const toNewMusicEvent = (
  parsedEvent: ParsedMusicEvent,
  post: InstagramPost
): NewMusicEvent => {
  const needsReview =
    parsedEvent.startDateTime === undefined ||
    parsedEvent.doorPrice === undefined ||
    parsedEvent.eventType === undefined ||
    parsedEvent.artists === undefined;

  return {
    openDateTime: parsedEvent.openDateTime,
    startDateTime: parsedEvent.startDateTime,
    earlyPrice: parsedEvent.earlyPrice,
    doorPrice: parsedEvent.doorPrice,
    eventType: parsedEvent.eventType,
    venueId: post.accountId,
    link: post.link,
    reviewStatus: needsReview ? ReviewStatus.NEEDS_REVIEW : ReviewStatus.VALID,
  };
};
