import { MusicEventGroup } from "./ui/music-event-group";
import {
  ClientArtist,
  ClientMusicEvent,
  DatabaseManager,
} from "./lib/database/db-manager";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllUpcomingMusicEvents();
  const musicEventGroups = musicEvents.reduce((acc, musicEvent) => {
    const key = `${musicEvent.startDateTime.getUTCMonth()}/${musicEvent.startDateTime.getUTCDate()}/${musicEvent.startDateTime.getUTCFullYear()}`;

    acc[key] ||= [];
    acc[key].push(musicEvent);
    return acc;
  }, {} as Record<string, ClientMusicEvent[]>);

  return (
    <div className="flex min-h-screen flex-col">
      <div>
        {Object.entries(musicEventGroups).map(([date, musicEvents]) => (
          <MusicEventGroup
            key={date}
            groupDate={musicEvents[0].startDateTime}
            musicEvents={musicEvents}
          />
        ))}
      </div>
    </div>
  );
}
