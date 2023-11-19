"use server";

import { FormState as MusicEventUpdateFormState } from "@/app/[locale]/admin/page";
import { EVENTS_PER_LOAD } from "./constants";
import {
  ClientMusicEvent,
  DatabaseManager,
  UpdatedMusicArtist,
  UpdatedMusicEvent,
} from "./database/db-manager";

export const fetchMusicEvents = (
  queryOptions: {
    offset: number;
    limit?: number;
  } = {
    offset: 0,
    limit: EVENTS_PER_LOAD,
  }
): Promise<ClientMusicEvent[]> => {
  return DatabaseManager.getAllUpcomingMusicEvents({
    offset: queryOptions.offset,
    limit: queryOptions.limit,
  });
};

export const authAdmin = async (password: string): Promise<boolean> => {
  return password === process.env.WEB_ADMIN_PASSWORD;
};

export const updateMusicEvent = async (
  prevState: MusicEventUpdateFormState,
  formData: FormData
): Promise<MusicEventUpdateFormState> => {
  const rawFormData = {
    ...Object.fromEntries(formData),
  };

  const event: UpdatedMusicEvent = {};
  const artistsMap: Record<string, UpdatedMusicArtist> = {};

  for (const key in rawFormData) {
    // TODO this is a hacky way to get the model name, prop name, and model id
    //      input tag ids MUST follow the format of modelName_propName_modelId
    const [modelName, propName, modelId] = key.split("_");

    if (modelName === "musicEvent") {
      // note: inset logic here for the future if there are music props we want to update
    } else if (modelName === "artist") {
      if (!artistsMap[modelId]) {
        artistsMap[modelId] = {
          id: modelId,
          name: "",
          genre: null,
          instagramUsername: null,
          spotifyId: null,
          youtubeId: null,
          isRecommended: false,
        };
      }

      // want to make sure we set null here and not empty str
      // @ts-ignore
      artistsMap[modelId][propName] =
        propName === "isRecommended"
          ? rawFormData[key] === "yes"
          : rawFormData[key] || null;
    } else {
      console.error("unexpected model name", modelName);
    }
  }

  const artists = Object.values(artistsMap);

  console.log("starting update for db models", { event, artists });

  try {
    const updateMusicArtistPromises = artists.map((artist) =>
      DatabaseManager.updateMusicArtistById(artist.id as string, {
        ...artist,
        id: undefined, // do this so that we don't accidentally update the id
      })
    );

    const updateResults = await Promise.all(updateMusicArtistPromises);

    console.log("update success!", { updateResults: updateResults.length });
    return { lastUpdated: "👍: " + new Date().toISOString() };
  } catch (error) {
    console.error("something went wrong during update", error);
    return { lastUpdated: "👎: : " + new Date().toISOString() };
  }
};
