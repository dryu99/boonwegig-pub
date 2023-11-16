/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src"],
  testPathIgnorePatterns: ["./src/services/chatgpt.service.test.ts"],
};
