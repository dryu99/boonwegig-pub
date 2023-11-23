import { NewMusicArtist } from "../../database/models/music-artist";
import {
  NewMusicEvent,
  MusicEventType,
  NewMusicEventWithArtists,
} from "../../database/models/music-event";
import { ReviewStatus } from "../../utils/types";

export class MusicEventBuilder {
  private musicEvent: NewMusicEvent & { artists?: NewMusicArtist[] };

  constructor() {
    this.musicEvent = {
      eventType: MusicEventType.CONCERT,
      isFree: false,
      link: "https://example.com",
      reviewStatus: ReviewStatus.PENDING,
      startDateTime: new Date("2023-12-25T21:00:00+09:00"),
      venueId: null,
    };
  }

  withId(id: string) {
    this.musicEvent.id = id;
    return this;
  }

  withVenueId(venueId: string) {
    this.musicEvent.venueId = venueId;
    return this;
  }

  withArtists(artists: NewMusicArtist[]) {
    this.musicEvent.artists = artists;
    return this;
  }

  withStartDateTime(date: Date | string) {
    this.musicEvent.startDateTime = new Date(date);
    return this;
  }

  build() {
    return this.musicEvent;
  }
}
