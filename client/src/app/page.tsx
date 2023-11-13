import Image from "next/image";
import {
  ClientArtist,
  ClientMusicEvent,
  DatabaseManager,
} from "./lib/database/db-manager";
import { EventDate } from "./ui/event-date";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllUpcomingMusicEvents();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>
        {musicEvents.map((musicEvent) => (
          <MusicEvent key={musicEvent.id} musicEvent={musicEvent} />
        ))}
      </div>
    </main>
  );
}

const MusicEvent = ({ musicEvent }: { musicEvent: ClientMusicEvent }) => {
  return (
    <div className="flex m-1">
      <EventDate
        startDate={musicEvent.startDateTime}
        createDate={musicEvent.createdAt}
      />
      <div className="flex-none p-1 w-36">
        <div>
          <a
            href={`https://www.instagram.com/${musicEvent.venue?.instagramUsername}`}
            className="hover:underline"
          >
            {musicEvent.venue?.name}
          </a>
        </div>
      </div>
      <div className="flex-none p-1 w-60">
        {musicEvent.artists.map((artist: ClientArtist, i: number) => (
          <>
            <a
              key={i}
              href={`https://music.youtube.com/search?q=${artist.name}`}
              className="hover:underline"
            >
              {artist.name}
            </a>
            {i !== musicEvent.artists.length - 1 && <span>, </span>}
          </>
        ))}
      </div>
      <div className="flex-none p-1 w-12">
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={musicEvent.link}
        >
          link
        </a>
      </div>
    </div>
  );
};
