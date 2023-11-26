"use server";

import { FormState as MusicEventUpdateFormState } from "@/app/[locale]/admin/page";
import { EVENTS_PER_LOAD } from "./constants";
import {
  ClientMusicEvent,
  DatabaseManager,
  UpdatedMusicArtist,
  UpdatedMusicEvent,
} from "./database/db-manager";
import { AppLocale } from "./locale";

// TODO break up this file into smaller files (create action folder or sth)

// TODO should prob fetch default events by default lol
// by default fetches all events regardless of review status
export const fetchUpcomingMusicEvents = ({
  offset = 0,
  limit = EVENTS_PER_LOAD,
  filter = {},
}): Promise<ClientMusicEvent[]> => {
  return DatabaseManager.getUpcomingMusicEvents({
    offset,
    limit,
    filter,
  });
};

export const fetchUpcomingMusicEventsForArtist = (
  artistId: string,
  { offset = 0, limit = EVENTS_PER_LOAD }
) => {
  return DatabaseManager.getUpcomingMusicEventsForArtist(artistId, {
    offset,
    limit,
  });
};

export const fetchManyVenues = (
  locale: AppLocale,
  options: {
    filter: {
      city: string;
    };
  }
) => {
  return DatabaseManager.getManyVenues(locale, options);
};

export const fetchManyMusicArtists = (locale: AppLocale, options: {}) => {
  return DatabaseManager.getManyMusicArtists(locale, options);
};

export const fetchVenueBySlug = async (slug: string) => {
  return DatabaseManager.getVenueBySlug(slug);
};

export const fetchMusicEventBySlug = async (slug: string) => {
  return DatabaseManager.getMusicEventBySlug(slug);
};

export const fetchMusicArtistBySlug = async (slug: string) => {
  return DatabaseManager.getMusicArtistBySlug(slug);
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
      event.id = modelId;

      // @ts-ignore
      // make sure we set null here and not empty str
      event[propName] = rawFormData[key] || null; // TODO maybe worth moving cleanup logic above before we start iterating
    } else if (modelName === "artist") {
      if (!artistsMap[modelId]) {
        artistsMap[modelId] = { id: modelId };
      }

      // @ts-ignore
      artistsMap[modelId][propName] =
        propName === "isRecommended"
          ? rawFormData[key] === "yes"
          : rawFormData[key] || null; // make sure we set null here and not empty str
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

    const updateMusicEventPromise = DatabaseManager.updateMusicEventById(
      event.id as string,
      { ...event, id: undefined } // do this so that we don't accidentally update the id
    );

    const updateResults = await Promise.all([
      ...updateMusicArtistPromises,
      updateMusicEventPromise,
    ]);

    console.log("update success!", { updateResults: updateResults.length });
    return { lastUpdated: "✅: " + new Date().toISOString() };
  } catch (error) {
    console.error("something went wrong during update", error);
    return { lastUpdated: "❌: : " + new Date().toISOString() };
  }
};
