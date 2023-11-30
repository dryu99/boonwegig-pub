"use client";

import {
  authAdmin,
  fetchUpcomingMusicEvents,
  updateMusicEvent,
} from "@/lib/actions";
import { ClientMusicArtist, ClientMusicEvent } from "@/lib/database/db-manager";
import { MusicGenre } from "@/lib/genre";
import { FormEvent, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  toGoogleSearchLink,
  toInstagramProfileLink,
  toSpotifyArtistLink,
  toSpotifySearchLink,
  toYoutubeChannelLink,
  toYoutubeSearchLink,
} from "@/lib/external-links";
import { AppCity } from "@/lib/city";

// TODO also need to implement pagination or sth
export default function AdminPage({
  params: { city },
}: {
  params: { city: AppCity };
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [musicEvents, setMusicEvents] = useState<ClientMusicEvent[]>([]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value;
    const authResult = await authAdmin(password);

    if (authResult) {
      setIsAuthorized(authResult);
      const newMusicEvents = await fetchUpcomingMusicEvents({
        limit: 300, // TODO lower limit or implement pagination if performance gets spicy
        filter: { city },
      });
      setMusicEvents(newMusicEvents);
    }
  };

  return (
    <div>
      <h2 className="mb-2">Admin</h2>
      {!isAuthorized ? (
        <form onSubmit={submitForm}>
          <div className="mt-4">
            <label htmlFor="password">Password</label>
            <div className="text-black">
              <input id="password" type="password" name="password" />
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div>
            <ul>
              {musicEvents.map((musicEvent) => (
                <MusicEventEditForm
                  key={musicEvent.id}
                  musicEvent={musicEvent}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export type FormState = {
  lastUpdated?: string;
};

// note: a lot of coupling happening here between the input id format and the parsing logic
const MusicEventEditForm = ({
  musicEvent,
}: {
  musicEvent: ClientMusicEvent;
}) => {
  const [formState, action] = useFormState<FormState, FormData>(
    updateMusicEvent,
    {}
  );

  return (
    <form action={action} key={musicEvent.id}>
      <div className="flex flex-row mb-5">
        <div className="flex flex-col mr-3">
          <div>
            <a
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              href={musicEvent.link}
            >
              link
            </a>
          </div>
          <div>
            <select
              className="text-black"
              name={`musicEvent_reviewStatus_${musicEvent.id}`}
              id={`musicEvent_reviewStatus_${musicEvent.id}`}
              defaultValue={musicEvent.reviewStatus}
            >
              <option key={"PENDING"} value={"PENDING"}>
                {"PENDING"}
              </option>
              <option key={"VALID"} value={"VALID"}>
                {"VALID"}
              </option>
              <option key={"INVALID"} value={"INVALID"}>
                {"INVALID"}
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          {musicEvent.artists.map((artist, i) => (
            <div key={artist.id} className="flex flex-row">
              <div className="mr-2">{i + 1}.</div>
              <div className="flex flex-col mr-3">
                <label htmlFor={`artist_name_${artist.id}`}>
                  <a
                    href={toGoogleSearchLink(artist.name)}
                    className="hover:underline text-blue-600"
                  >
                    name
                  </a>
                </label>
                <input
                  className="text-black"
                  id={`artist_name_${artist.id}`}
                  type="text"
                  name={`artist_name_${artist.id}`}
                  defaultValue={artist.name}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist_genre_${artist.id}`}>genre</label>
                <select
                  className="text-black"
                  name={`artist_genre_${artist.id}`}
                  id={`artist_genre_${artist.id}`}
                  defaultValue={artist.genre || ""}
                >
                  {Object.values(MusicGenre).map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-40 mr-3">
                <label htmlFor={`artist_instagramUsername_${artist.id}`}>
                  <a
                    href={
                      artist.instagramUsername
                        ? toInstagramProfileLink(artist.instagramUsername)
                        : toGoogleSearchLink(artist.name) + " instagram"
                    }
                    className="hover:underline text-blue-600"
                  >
                    insta
                  </a>
                </label>
                <input
                  className="text-black"
                  id={`artist_instagramUsername_${artist.id}`}
                  type="text"
                  name={`artist_instagramUsername_${artist.id}`}
                  defaultValue={artist.instagramUsername || ""}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist_spotifyId_${artist.id}`}>
                  <a
                    href={
                      artist.spotifyId
                        ? toSpotifyArtistLink(artist.spotifyId)
                        : toSpotifySearchLink(artist.name)
                    }
                    className="hover:underline text-blue-600"
                  >
                    spotify
                  </a>
                </label>
                <input
                  className="text-black"
                  id={`artist_spotifyId_${artist.id}`}
                  type="text"
                  name={`artist_spotifyId_${artist.id}`}
                  defaultValue={artist.spotifyId || ""}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist_youtubeId_${artist.id}`}>
                  <a
                    href={
                      artist.youtubeId
                        ? toYoutubeChannelLink(artist.youtubeId)
                        : toYoutubeSearchLink(artist.name)
                    }
                    className="hover:underline text-blue-600"
                  >
                    youtube
                  </a>
                </label>
                <input
                  className="text-black"
                  id={`artist_youtubeId_${artist.id}`}
                  type="text"
                  name={`artist_youtubeId_${artist.id}`}
                  defaultValue={artist.youtubeId || ""}
                />
              </div>
              <div className="flex flex-col mr-3">
                <label
                  className="inline-block"
                  htmlFor={`artist_isRecommended_${artist.id}`}
                >
                  rec?
                </label>
                <select
                  className="text-black"
                  name={`artist_isRecommended_${artist.id}`}
                  id={`artist_isRecommended_${artist.id}`}
                  defaultValue={artist.isRecommended ? "yes" : "no"}
                >
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
              </div>
            </div>
          ))}
          <EditButton />
          <div>last updated: {formState.lastUpdated}</div>
        </div>
      </div>
    </form>
  );
};

const EditButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`mt-3 hover:bg-secondary ${
        pending ? "bg-yellow-400" : "bg-tertiary"
      }`}
      disabled={pending}
    >
      Submit update
    </button>
  );
};
