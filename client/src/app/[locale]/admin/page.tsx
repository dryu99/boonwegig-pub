"use client";

import { authAdmin, fetchMusicEvents } from "@/lib/actions";
import { ClientMusicEvent } from "@/lib/database/db-manager";
import { FormEvent, useState } from "react";

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
              <input id="password" type="password" name="password" required />
            </div>
          </div>
        </form>
      ) : (
        <div>
          <h2>Welcome Admin</h2>
          <div>
            <ul>
              {musicEvents.map((musicEvent) => (
                <form key={musicEvent.id}>
                  <div className="flex flex-row mb-5">
                    <div className="mr-3">
                      <a
                        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        href={musicEvent.link}
                      >
                        link
                      </a>
                    </div>
                    <div className="flex flex-col">
                      {musicEvent.artists.map((artist, i) => (
                        <div key={artist.id} className="flex flex-row">
                          <div className="mr-2">{i + 1}.</div>
                          <div className="flex flex-col mr-3">
                            <label htmlFor="artist-name">name</label>
                            <input
                              className="text-black"
                              id="artist-name"
                              type="text"
                              name="artist-name"
                              value={artist.name}
                            />
                          </div>
                          <div className="flex flex-col w-20 mr-3">
                            <label htmlFor="genre">genre</label>
                            <input
                              className="text-black"
                              id="artist-genre"
                              type="text"
                              name="artist-genre"
                              value={artist.genre || ""}
                            />
                          </div>
                          <div className="flex flex-col w-40 mr-3">
                            <label htmlFor="insta">insta</label>
                            <input
                              className="text-black"
                              id="artist-insta"
                              type="text"
                              name="artist-insta"
                              value={artist.instagramUsername || ""}
                            />
                          </div>
                          <div className="flex flex-col w-20 mr-3">
                            <label htmlFor="spotify">spotify</label>
                            <input
                              className="text-black"
                              id="artist-spotify"
                              type="text"
                              name="artist-spotify"
                              value={artist.spotifyId || ""}
                            />
                          </div>
                          <div className="flex flex-col w-20 mr-3">
                            <label htmlFor="youtube">youtube</label>
                            <input
                              className="text-black"
                              id="artist-youtube"
                              type="text"
                              name="artist-youtube"
                              value={artist.youtubeId || ""}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
