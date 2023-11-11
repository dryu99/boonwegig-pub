import { describe, expect, test } from "@jest/globals";
import { MusicEventModel, MusicEventType } from "./music-event";
import { ReviewStatus } from "../../utils/types";

describe("MusicEventModel", () => {
  describe("inferStartDate", () => {
    test("eventStartDate >= postCreateDate", () => {
      const result = MusicEventModel["inferStartDate"](
        new Date("2023-11-16T11:00:00.000Z"),
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2023-11-16T11:00:00.000Z"));
    });

    test("eventStartYear < postCreateYear AND eventStartDay > postCreateDay", () => {
      const result = MusicEventModel["inferStartDate"](
        new Date("2019-11-16T11:00:00.000Z"),
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2023-11-16T11:00:00.000Z"));
    });

    test("eventStartYear < postCreateYear AND eventStartDay < postCreateDay", () => {
      const result = MusicEventModel["inferStartDate"](
        new Date("2019-11-02T11:00:00.000Z"),
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2024-11-02T11:00:00.000Z"));
    });
  });

  describe("toNew", () => {
    test("valid parsed event", () => {
      const result = MusicEventModel.toNew(
        {
          musicArtists: ["artist1", "artist2"],
          startDateTime: "2023-11-16T11:00:00.000Z",
          isFree: true,
          eventType: MusicEventType.CONCERT,
        },
        {
          link: "https://www.instagram.com/p/123/",
          timestamp: new Date("2023-11-10T05:48:04.000Z"),
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
          name: null,
        }
      );
      expect(result).toEqual({
        artistNames: ["artist1", "artist2"],
        eventType: MusicEventType.CONCERT,
        isFree: true,
        link: "https://www.instagram.com/p/123/",
        reviewStatus: ReviewStatus.VALID,
        startDateTime: "2023-11-16T11:00:00.000Z+09",
        venueId: "venue1",
      });
    });
  });
});
