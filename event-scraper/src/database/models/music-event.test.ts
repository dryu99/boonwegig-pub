import { describe, expect, test } from "@jest/globals";
import { MusicEventModel, MusicEventType } from "./music-event";
import { ReviewStatus } from "../../utils/types";

describe("MusicEventModel", () => {
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
    test("valid parsed event", () => {
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
        {
          id: "venue1",
          instagramUsername: "venue1",
          city: "Seoul",
          country: "KR",
          reviewStatus: ReviewStatus.VALID,
          createdAt: new Date(),
          updatedAt: new Date(),
          businessAddressJson: null,
          businessEmail: null,
          businessPhoneNumber: null,
          externalLink: null,
          instagramId: null,
          name: "venue 1",
          slug: "venue-1",
          externalMapsJson: null,
          localName: null,
        }
      );
      expect(result).toEqual({
        artistNames: ["artist1", "artist2"],
        eventType: MusicEventType.CONCERT,
        isFree: true,
        link: "https://www.instagram.com/p/123/",
        reviewStatus: ReviewStatus.PENDING,
        startDateTime: "2023-11-16T11:00:00.000+09:00",
        venueId: "venue1",
      });
    });
  });
});
