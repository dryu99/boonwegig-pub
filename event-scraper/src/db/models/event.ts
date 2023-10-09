import { InstagramPost } from "../../services/instagram.service";
import { UUID } from "../../utils/types";

// the music event parsed
export type ParsedMusicEvent = {
  openDateTime?: string; // ISO format
  startDateTime?: string; // ISO format
  earlyPrice?: number;
  doorPrice?: number; // -1 if donation
  eventType?: "concert" | "dj";
  artists?: string[];
};

// the music event to be inserted into the db
export type NewMusicEvent = {
  venueId: UUID;
  link: string;
  country: string; // TODO add to venue
  city: string; // TODO add to venue
  reviewStatus: ReviewStatus;
  openDateTime?: string;
  startDateTime?: string;
  earlyPrice?: number;
  doorPrice?: number;
  eventType?: "concert" | "dj";
};

// export type MusicEvent = NewMusicEvent & {
//   id: UUID;
//   artists: UUID[];
// };

enum ReviewStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  NEEDS_REVIEW = "NEEDS_REVIEW",
}

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
    country: "KR", // TODO make dynamic
    city: "Seoul", // TODO make dynamic
    reviewStatus: needsReview ? ReviewStatus.NEEDS_REVIEW : ReviewStatus.VALID,
  };
};
