import {
  ClientArtist,
  ClientMusicEvent,
  DatabaseManager,
} from "./lib/database/db-manager";
import { DateHelper } from "./lib/date.helper";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllUpcomingMusicEvents();
  const musicEventGroups = musicEvents.reduce((acc, musicEvent) => {
    const key = `${musicEvent.startDateTime.getUTCMonth()}/${musicEvent.startDateTime.getUTCDate()}`;

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
            groupDate={musicEvents[0].startDateTime}
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
  const groupDateParts = DateHelper.extractParts(groupDate);

  return (
    <div>
      <div>
        <span className="text-2xl mr-1 font-bold align-middle">
          {groupDateParts.dateStr}
        </span>
        <span className="align-middle">({groupDateParts.dayOfWeek})</span>
      </div>
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
  const dateParts = DateHelper.extractParts(musicEvent.startDateTime);

  return (
    <div className="flex mb-3">
      <div className="flex-none mr-3 w-36">
        <div>
          <span className="mr-2">{dateParts.timeStr}</span>
          {musicEvent.isFree && (
            <span className="text-yellow-400 mr-2">FREE</span>
          )}
          {DateHelper.isRecent(musicEvent.createdAt) && (
            <span className="text-blue-400">New</span>
          )}
        </div>
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
