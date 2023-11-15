import {
  ClientArtist,
  ClientMusicEvent,
  DatabaseManager,
} from "./lib/database/db-manager";
import { DateHelper } from "./lib/date.helper";
import { EventDate, EventTime } from "./ui/event-date";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllUpcomingMusicEvents();
  const musicEventGroups = musicEvents.reduce((acc, musicEvent) => {
    const startDateParts = DateHelper.extractParts(musicEvent.startDateTime);
    const key = `${startDateParts.year}/${startDateParts.month}/${startDateParts.day}`;

    acc[key] ||= [];
    acc[key].push(musicEvent);
    return acc;
  }, {} as Record<string, ClientMusicEvent[]>);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>
        {Object.entries(musicEventGroups).map(([date, musicEvents]) => (
          <MusicEventGroup
            key={date}
            groupDate={new Date(date)}
            musicEvents={musicEvents}
          />
        ))}
      </div>
    </main>
  );
}

const MusicEventGroup = ({
  groupDate,
  musicEvents,
}: {
  groupDate: Date;
  musicEvents: ClientMusicEvent[];
}) => {
  return (
    <div>
      <EventDate date={groupDate} />
      <hr className="mb-2 w-32" />
      <div>
        {musicEvents.map((musicEvent, i) => (
          <MusicEvent key={musicEvent.id} musicEvent={musicEvent} />
        ))}
      </div>
    </div>
  );
};

const MusicEvent = ({ musicEvent }: { musicEvent: ClientMusicEvent }) => {
  return (
    <div className="flex mb-3">
      <div className="flex-none mr-3 w-36">
        <EventTime date={musicEvent.startDateTime} />
      </div>
      <div className="flex-none mr-3 w-36">
        <div>
          <a
            href={`https://www.instagram.com/${musicEvent.venue?.instagramUsername}`}
            className="hover:underline"
          >
            {musicEvent.venue?.name}
          </a>
        </div>
      </div>
      <div className="flex-none mr-3 w-60">
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
      <div className="flex-none w-12">
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
