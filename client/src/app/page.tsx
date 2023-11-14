import Image from "next/image";
import {
  ClientArtist,
  ClientMusicEvent,
  DatabaseManager,
} from "./lib/database/db-manager";
import { DateHelper } from "./lib/date.helper";

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
  const startDateParts = DateHelper.extractParts(musicEvent.startDateTime);

  // TODO fix issue where date is not aligned with other columns
  return (
    <div className="flex mb-3">
      <div className="flex-none mr-3 w-36">
        <div>
          <span className="text-2xl mr-1 font-bold align-middle">
            {startDateParts.month}/{startDateParts.day}
          </span>
          <span className="align-middle">({startDateParts.dayOfWeek})</span>
        </div>
        <div>
          <span className="mr-2">{startDateParts.time}</span>
          {/* {musicEvent.isFree && (
            <span className="text-yellow-400 mr-2">Free</span>
          )} */}
          {DateHelper.isRecent(musicEvent.createdAt) && (
            <span className="text-blue-400">New</span>
          )}
        </div>
      </div>
      <div className="flex-none mt-1 mr-3 w-36">
        <div>
          <a
            href={`https://www.instagram.com/${musicEvent.venue?.instagramUsername}`}
            className="hover:underline"
          >
            {musicEvent.venue?.name}
          </a>
        </div>
      </div>
      <div className="flex-none mt-1 mr-3 w-60">
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
      <div className="flex-none mt-1 w-12">
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
