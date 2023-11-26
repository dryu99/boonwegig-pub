import { NewMusicArtist } from "../../database/models/music-artist";
import {
  NewMusicEvent,
  MusicEventType,
  NewMusicEventWithArtists,
  MusicEventModel,
} from "../../database/models/music-event";
import { ReviewStatus, UUID } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";

export class MusicEventBuilder {
  private musicEvent: NewMusicEvent & { artists?: NewMusicArtist[] };

  constructor() {
    const id = uuidv4();

    this.musicEvent = {
      id,
      eventType: MusicEventType.CONCERT,
      isFree: false,
      link: "https://example.com",
      reviewStatus: ReviewStatus.PENDING,
      startDateTime: new Date("2023-12-25T21:00:00+09:00"),
      venueId: null,
      slug: `test-venue-slug-${id.split("-")[0]}`,
    };
  }

  public withId(id: UUID) {
    this.musicEvent.id = id;
    return this;
  }

  public withVenueId(venueId: UUID) {
    this.musicEvent.venueId = venueId;
    return this;
  }

  public withArtists(artists: NewMusicArtist[]) {
    this.musicEvent.artists = artists;
    return this;
  }

  public withStartDateTime(date: Date | string) {
    this.musicEvent.startDateTime = new Date(date);
    return this;
  }

  public withSlug(slug: string) {
    this.musicEvent.slug = slug;
    return this;
  }

  public build() {
    return this.musicEvent;
  }
}
