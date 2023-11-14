import { describe, expect, test } from "@jest/globals";
import { Config, resolveByEnv } from "./config";

// TODO finish this test once you make Config a class and add a load() method
describe("Config", () => {
  describe("resolveByEnv", () => {
    test("should return dev value when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      const result = resolveByEnv({
        dev: 1,
        prod: 2,
      });
      expect(result).toEqual(1);
    });

    test("should return prod value when NODE_ENV is production", () => {
      process.env.NODE_ENV = "production";
      const result = resolveByEnv({
        dev: 1,
        prod: 2,
      });
      expect(result).toEqual(2);
    });
  });
});
