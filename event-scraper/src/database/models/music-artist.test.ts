import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import { Migrator } from "kysely";
import path from "path";
import { DatabaseManager } from "../db-manager";
import { migrateDown, migrateLatest } from "../../tests/test.helper";
import { MusicArtistModel } from "./music-artist";

describe("MusicEventModel", () => {
  describe("toNew", () => {
    test("valid parsed music artist with ascii name", async () => {
      const newArtist = MusicArtistModel.toNew("artist1");

      expect(newArtist).toEqual({
        id: expect.any(String),
        name: "artist1",
        reviewStatus: "PENDING",
        slug: `artist1-${newArtist.id!.split("-")[0]}`,
      });
    });

    test("valid parsed music artist with non-ascii name", async () => {
      const newArtist = MusicArtistModel.toNew("빌장");

      expect(newArtist).toEqual({
        id: expect.any(String),
        name: "빌장",
        reviewStatus: "PENDING",
        slug: `${newArtist.id!.split("-")[0]}-${newArtist.id!.split("-")[1]}`,
      });
    });
  });
});
