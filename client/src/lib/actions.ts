"use server";

import { EVENTS_PER_LOAD } from "./constants";
import { ClientMusicEvent, DatabaseManager } from "./database/db-manager";

export const fetchMusicEvents = (
  queryOptions: {
    offset: number;
  } = {
    offset: 0,
  }
): Promise<ClientMusicEvent[]> => {
  return DatabaseManager.getAllUpcomingMusicEvents({
    offset: queryOptions.offset,
    limit: EVENTS_PER_LOAD,
  });
};

export const authAdmin = async (password: string): Promise<boolean> => {
  return password === process.env.WEB_ADMIN_PASSWORD;
};

export const updateMusicEvent = async (
  prevState: any, // TODO change
  formData: FormData
): Promise<void> => {
  await wait(5000);
  // return DatabaseManager.updateMusicEvent(musicEvent);
  console.log({ prevState, formData: Object.fromEntries(formData) });
};

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
