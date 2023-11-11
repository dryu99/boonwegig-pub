import { describe, expect, test } from "@jest/globals";
import { MusicEventModel } from "./music-event";

describe("MusicEventModel", () => {
  describe("inferStartDate", () => {
    test("eventStartDate >= postCreateDate", () => {
      const result = MusicEventModel["inferStartDate"](
        "2023-11-16T11:00:00.000Z",
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2023-11-16T11:00:00.000Z"));
    });

    test("eventStartYear < postCreateYear AND eventStartDay > postCreateDay", () => {
      const result = MusicEventModel["inferStartDate"](
        "2019-11-16T11:00:00.000Z",
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2023-11-16T11:00:00.000Z"));
    });

    test("eventStartYear < postCreateYear AND eventStartDay < postCreateDay", () => {
      const result = MusicEventModel["inferStartDate"](
        "2019-11-02T11:00:00.000Z",
        new Date("2023-11-10T05:48:04.000Z")
      );
      expect(result).toEqual(new Date("2024-11-02T11:00:00.000Z"));
    });
  });
});
