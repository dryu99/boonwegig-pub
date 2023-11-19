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
  const rawFormData = {
    ...Object.fromEntries(formData),
  };

  const event = {
    id: "",
    isRecommended: false,
  };

  // TODO create type for insertable artist (can prob use keysely type)
  const artistsMap: Record<string, any> = {};

  for (const key in rawFormData) {
    // TODO this is a hacky way to get the model name, prop name, and model id
    //      input tag ids MUST follow the format of modelName_propName_modelId
    const [modelName, propName, modelId] = key.split("_");

    if (modelName === "musicEvent") {
      if (propName === "isRecommended") {
        event.isRecommended = rawFormData[key] === "yes";
        event.id = modelId;
      }
    } else if (modelName === "artist") {
      if (!artistsMap[modelId]) {
        artistsMap[modelId] = {
          id: modelId,
          name: null,
          genre: null,
          instagramUsername: null,
          spotifyId: null,
          youtubeId: null,
        };
      }
      artistsMap[modelId][propName] = rawFormData[key];
    } else {
      console.error("unexpected model name", modelName);
    }
  }

  const artists = Object.values(artistsMap);
  // return DatabaseManager.updateMusicEvent(musicEvent);
};
