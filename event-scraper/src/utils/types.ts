export type UUID = string;

export type Nullable<T> = T | null | undefined;

export enum ReviewStatus {
  VALID = "VALID", // entity is valid and doesn't currently require review
  INVALID = "INVALID", // entity is invalid and needs to be updated/deleted
  PENDING = "PENDING", // entity has been created/updated and needs manual review
}
