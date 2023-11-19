"use client";

import { authAdmin, fetchMusicEvents, updateMusicEvent } from "@/lib/actions";
import { ClientArtist, ClientMusicEvent } from "@/lib/database/db-manager";
import { MusicGenre } from "@/lib/constants";
import { FormEvent, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [musicEvents, setMusicEvents] = useState<ClientMusicEvent[]>([]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.password.value;
    const authResult = await authAdmin(password);

    setIsAuthorized(authResult);

    if (authResult) {
      const newMusicEvents = await fetchMusicEvents();
      setMusicEvents(newMusicEvents);
    }
  };

  return (
    <div>
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
          <h2>Welcome Admin</h2>
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
  message?: string;
};

const MusicEventEditForm = ({
  musicEvent,
}: {
  musicEvent: ClientMusicEvent;
}) => {
  const [formState, action] = useFormState(updateMusicEvent, undefined);

  return (
    <form action={action} key={musicEvent.id}>
      <div className="flex flex-row mb-5">
        <div className="mr-3">
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href={musicEvent.link}
          >
            link
          </a>
        </div>
        <div className=" mr-3">
          <label
            className="inline-block"
            htmlFor={`recommend-${musicEvent.id}`}
          >
            rec?
          </label>
          <select
            className="text-black"
            name={`recommend-${musicEvent.id}`}
            id={`recommend-${musicEvent.id}`}
            defaultValue={musicEvent.isRecommended ? "yes" : "no"}
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
        <div className="flex flex-col">
          {musicEvent.artists.map((artist, i) => (
            <div key={artist.id} className="flex flex-row">
              <div className="mr-2">{i + 1}.</div>
              <div className="flex flex-col mr-3">
                <label htmlFor={`artist-name-${artist.id}`}>name</label>
                <input
                  className="text-black"
                  id={`artist-name-${artist.id}`}
                  type="text"
                  name={`artist-name-${artist.id}`}
                  defaultValue={artist.name}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist-genre-${artist.id}`}>genre</label>
                <select
                  className="text-black"
                  name={`artist-genre-${artist.id}`}
                  id={`artist-genre-${artist.id}`}
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
                <label htmlFor={`artist-insta-${artist.id}`}>insta</label>
                <input
                  className="text-black"
                  id={`artist-insta-${artist.id}`}
                  type="text"
                  name={`artist-insta-${artist.id}`}
                  defaultValue={artist.instagramUsername || ""}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist-spotify-${artist.id}`}>spotify</label>
                <input
                  className="text-black"
                  id={`artist-spotify-${artist.id}`}
                  type="text"
                  name={`artist-spotify-${artist.id}`}
                  defaultValue={artist.spotifyId || ""}
                />
              </div>
              <div className="flex flex-col w-20 mr-3">
                <label htmlFor={`artist-youtube-${artist.id}`}>youtube</label>
                <input
                  className="text-black"
                  id={`artist-youtube-${artist.id}`}
                  type="text"
                  name={`artist-youtube-${artist.id}`}
                  defaultValue={artist.youtubeId || ""}
                />
              </div>
            </div>
          ))}
          <EditButton />
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
      Edit
    </button>
  );
};
