import {
  NewMusicEvent,
  MusicEventType,
} from "../../database/models/music-event";
import { NewVenue } from "../../database/models/venue";
import { ReviewStatus } from "../../utils/types";

export class VenueBuilder {
  private venue: NewVenue;

  constructor() {
    this.venue = {
      city: "Seoul",
      country: "KO",
      instagramUsername: "bill_john_99",
      reviewStatus: ReviewStatus.PENDING,
      name: "Bill John",
      slug: "bill_john",
    };
  }

  build() {
    return this.venue;
  }
}
