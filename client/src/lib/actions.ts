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
