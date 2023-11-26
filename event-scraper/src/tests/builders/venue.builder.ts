import {
  NewMusicEvent,
  MusicEventType,
} from "../../database/models/music-event";
import { NewVenue, VenueModel } from "../../database/models/venue";
import { ReviewStatus } from "../../utils/types";

export class VenueBuilder {
  private venue: NewVenue;

  constructor() {
    this.venue = {
      city: "Seoul",
      country: "KO",
      instagramUsername: "bill_john_cafe_99",
      reviewStatus: ReviewStatus.PENDING,
      name: "Bill John Cafe",
      slug: "bill-john-cafe",
    };
  }

  public build() {
    return this.venue;
  }
}
