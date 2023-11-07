import Image from "next/image";
import { DatabaseManager } from "./lib/db-manager";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllMusicEvents();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <h1 className="text-2xl pb-4">BoonWeGig</h1>
      {musicEvents.map((musicEvent) => (
        <div key={musicEvent.id} className="flex p-2">
          <div className="flex-none p-1 w-60">{musicEvent.start_date_time}</div>
          <div className="flex-none p-1 w-60">
            {musicEvent.artists.map((artist, i) => (
              <>
                <span key={i}>{artist}</span>
                {i !== musicEvent.artists.length - 1 && <span>, </span>}
              </>
            ))}
          </div>
          <div className="flex-none p-1 w-60">{musicEvent.venue_id}</div>
        </div>
      ))}
    </main>
  );
}
