import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import {
  MusicEventModel,
  MusicEventType,
  NewMusicEvent,
  NewMusicEventWithArtists,
} from "./music-event";
import { ReviewStatus } from "../../utils/types";
import { DatabaseManager } from "../db-manager";
import path from "node:path";
import { Migrator, NO_MIGRATIONS } from "kysely";
import { MusicEventBuilder } from "../../tests/builders/music-event.builder";
import { VenueBuilder } from "../../tests/builders/venue.builder";
import { SavedVenue, VenueModel } from "./venue";
import { MusicArtistModel, NewMusicArtist } from "./music-artist";
import { v4 as uuidv4 } from "uuid";
import { MusicArtistBuilder } from "../../tests/builders/music-artist.builder";
import {
  migrateDown,
  migrateLatest,
  resetDbTables,
} from "../../tests/test.helper";

describe("MusicEventModel", () => {
  let migrator: Migrator;

  beforeAll(async () => {
    // Start db
    DatabaseManager.start();
    migrator = DatabaseManager.getMigrator(
      path.join(__dirname, "../migrations")
    );

    // clear prev db state and migrate to latest
    await resetDbTables(DatabaseManager.db);
    await migrateDown(migrator);
    await migrateLatest(migrator);
  });

  afterAll(async () => {
    // Stop db
    await DatabaseManager.stop();
  });

  // Reset db state
  beforeEach(async () => {
    await resetDbTables(DatabaseManager.db);
  });

  describe("inferStartDate", () => {
    test("eventStartDate >= postCreateDate", () => {
      const result = MusicEventModel["inferStartDate"](
        "2023-11-16T11:00:00",
        new Date("2023-11-10T05:48:04.000+09:00")
      );
      expect(result).toEqual("2023-11-16T11:00:00");
    });

    test("eventStartYear < postCreateYear AND eventStartDay > postCreateDay", () => {
      const result = MusicEventModel["inferStartDate"](
        "2019-11-16T11:00:00",
        new Date("2023-11-10T05:48:04.000+09:00")
      );
      expect(result).toEqual("2023-11-16T11:00:00");
    });
  });

  describe("toNew", () => {
    test("valid parsed event", async () => {
      // although this could be simplified with a non-new VenueBuilder, we shouldn't be building saved venues that aren't saved to the db
      const newVenue = new VenueBuilder().build();
      await VenueModel.addOne(newVenue);
      const savedVenue = await VenueModel.getOneByInstagramUsername(
        newVenue.instagramUsername
      );

      if (!savedVenue) throw new Error("savedVenue is undefined");

      const result = MusicEventModel.toNew(
        {
          musicArtists: ["artist1", "artist2"],
          startDateTime: "2023-11-16T11:00:00.000",
          isFree: true,
          eventType: MusicEventType.CONCERT,
        },
        {
          link: "https://www.instagram.com/p/123/",
          createdAt: new Date("2023-11-10T05:48:04.000Z"),
          id: "test_id",
          username: "test_username",
        },
        savedVenue
      );

      expect(result).toEqual({
        id: result.id,
        slug: `${newVenue.slug}-${result.id!.split("-")[0]}`,
        artists: [
          {
            id: result.artists[0].id,
            name: "artist1",
            reviewStatus: ReviewStatus.PENDING,
            slug: `artist1-${result.artists[0].id!.split("-")[0]}`,
          },
          {
            id: result.artists[1].id,
            name: "artist2",
            reviewStatus: ReviewStatus.PENDING,
            slug: `artist2-${result.artists[1].id!.split("-")[0]}`,
          },
        ],
        eventType: MusicEventType.CONCERT,
        isFree: true,
        link: "https://www.instagram.com/p/123/",
        reviewStatus: ReviewStatus.PENDING,
        startDateTime: "2023-11-16T11:00:00.000+09:00",
        venueId: savedVenue.id,
      });
    });
  });

  // TODO write venue tests + setup
  describe("database operations", () => {
    describe("addOne", () => {
      test("should successfully add music event", async () => {
        const newEvent: NewMusicEvent = new MusicEventBuilder().build();

        const result = await MusicEventModel.addOne(newEvent);
        const savedMusicEvent = await MusicEventModel.getOneById(result!.id);

        expect(savedMusicEvent).toMatchObject(newEvent);
      });

      test("should successfully add music event with custom id", async () => {
        const testId = uuidv4();

        const newEvent: NewMusicEvent = new MusicEventBuilder()
          .withId(testId)
          .build();

        const result = await MusicEventModel.addOne(newEvent);
        const savedMusicEvent = await MusicEventModel.getOneById(result!.id);

        if (!savedMusicEvent) throw new Error("savedMusicEvent is undefined");

        expect(savedMusicEvent.id).toEqual(testId);
      });

      test("should successfully add multiple music events with the same venue but different start times", async () => {
        const newVenue = new VenueBuilder().build();
        const savedVenue = await VenueModel.addOne(newVenue);

        const newEvent1 = new MusicEventBuilder()
          .withVenueId(savedVenue!.id)
          .withStartDateTime("2023-11-18T21:00:00+09:00")
          .build();

        const newEvent2 = new MusicEventBuilder()
          .withVenueId(savedVenue!.id)
          .withStartDateTime("2023-11-18T21:30:00+09:00")
          .build();

        const result1 = await MusicEventModel.addOne(newEvent1);
        expect(result1).toBeDefined();

        const result2 = await MusicEventModel.addOne(newEvent2);
        expect(result2).toBeDefined();
      });
    });

    describe("addOneWithArtists", () => {
      test("should successfully add music event with artists", async () => {
        const artists: NewMusicArtist[] = [
          new MusicArtistBuilder().withName("jpitme").build(),
          new MusicArtistBuilder().withName("(@billjohn)").build(),
          new MusicArtistBuilder().withName("yoshiyoshino").build(),
        ];
        const newEvent = new MusicEventBuilder()
          .withArtists(artists)
          .build() as NewMusicEventWithArtists;

        // call
        const result = await MusicEventModel.addOneWithArtists(newEvent);

        // assert event was saved
        const savedMusicEvent = await MusicEventModel.getOneById(
          result.savedMusicEvent.id
        );
        expect(savedMusicEvent).toBeDefined();

        // assert artists were saved
        const savedArtists = await MusicArtistModel.getManyByIds(
          result.savedArtists.map((a) => a.id)
        );
        expect(savedArtists).toHaveLength(artists.length);
        expect(savedArtists).toContainEqual(
          expect.objectContaining(result.savedArtists[0])
        );
        expect(savedArtists).toContainEqual(
          expect.objectContaining(result.savedArtists[1])
        );
        expect(savedArtists).toContainEqual(
          expect.objectContaining(result.savedArtists[2])
        );

        // assert event-artist pair was saved
        const savedPairs = await DatabaseManager.db
          .selectFrom("musicEventArtists")
          .selectAll()
          .where("eventId", "=", result.savedMusicEvent.id)
          .where(
            "artistId",
            "in",
            result.savedArtists.map((a) => a.id)
          )
          .execute();

        expect(savedPairs).toHaveLength(result.savedMusicEventArtists.length);
        expect(savedPairs).toContainEqual(result.savedMusicEventArtists[0]);
        expect(savedPairs).toContainEqual(result.savedMusicEventArtists[1]);
        expect(savedPairs).toContainEqual(result.savedMusicEventArtists[2]);
      });
    });

    test("should successfully add music event with artists, even if artist already exists (unique constraint)", async () => {
      const duplicateArtistName = "jpitme";

      const artists: NewMusicArtist[] = [
        new MusicArtistBuilder().withName(duplicateArtistName).build(),
        new MusicArtistBuilder().build(),
        new MusicArtistBuilder().withName("yoshino").build(),
      ];
      const newEvent1 = new MusicEventBuilder()
        .withArtists(artists)
        .build() as NewMusicEventWithArtists;

      // call
      await MusicEventModel.addOneWithArtists(newEvent1);

      // call again
      const newEvent2 = new MusicEventBuilder()
        .withArtists([
          new MusicArtistBuilder().withName(duplicateArtistName).build(),
          new MusicArtistBuilder().withName("michael yoshi").build(),
        ])
        .build() as NewMusicEventWithArtists;
      const result2 = await MusicEventModel.addOneWithArtists(newEvent2);

      // assert that no duplicate artists were saved
      expect(result2.savedArtists).toHaveLength(1);
      expect(result2.savedArtists).toContainEqual(
        expect.objectContaining({ name: "michael yoshi" })
      );

      // assert all event-artist pairs were saved
      const savedPairs = await DatabaseManager.db
        .selectFrom("musicEventArtists")
        .selectAll()
        .where("eventId", "=", result2.savedMusicEvent.id)
        .execute();

      expect(savedPairs).toHaveLength(2);
      expect(savedPairs).toContainEqual(result2.savedMusicEventArtists[0]);
      expect(savedPairs).toContainEqual(result2.savedMusicEventArtists[1]);
    });
  });
});
