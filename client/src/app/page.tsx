import Image from "next/image";
import { DatabaseManager } from "./lib/db-manager";
import { DateHelper } from "./lib/date.helper";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllMusicEvents();

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-2xl pb-4">BoonWeGig</h1>
      <div>
        {musicEvents.map((musicEvent) => (
          <MusicEvent key={musicEvent.id} musicEvent={musicEvent} />
        ))}
      </div>
    </main>
  );
}

const MusicEvent = ({ musicEvent }: any) => {
  const date = DateHelper.parseLocalDate(musicEvent.start_date_time);

  return (
    <div className="flex p-2">
      <div className="flex-none p-1 w-24">
        <div>{date.dayOfWeek}</div>
        <div>
          {date.month}/{date.day}
        </div>
        <div>{date.time}</div>
      </div>
      <div className="flex-none p-1 w-60">{musicEvent.venue_id}</div>
      <div className="flex-none p-1 w-60">
        {musicEvent.artists.map((artist: string, i: number) => (
          <>
            <span key={i}>{artist}</span>
            {i !== musicEvent.artists.length - 1 && <span>, </span>}
          </>
        ))}
      </div>
    </div>
  );
};
