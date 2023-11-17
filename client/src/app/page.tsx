import { fetchMusicEvents } from "@/lib/actions";
import { MusicEventListing } from "../ui/components/music-event-listing";

export default async function Home() {
  const musicEvents = await fetchMusicEvents();

  return (
    <div className="flex flex-col">
      <MusicEventListing initialMusicEvents={musicEvents} />
    </div>
  );
}
