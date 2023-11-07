import Image from "next/image";
import { DatabaseManager } from "./lib/db-manager";

export default async function Home() {
  const musicEvents = await DatabaseManager.getAllMusicEvents();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl">BoonWeGig</h1>
      {musicEvents.map((musicEvent) => (
        <div key={musicEvent.id} className="flex flex-col items-center">
          <div>{musicEvent.start_date_time}</div>
          <div>Venue: {musicEvent.venue_id}</div>
        </div>
      ))}
    </main>
  );
}
