import { ClientMusicEvent, ClientArtist } from "../lib/database/db-manager";
import { DateHelper } from "../lib/date.helper";
import Image from "next/image";

export const MusicEvent = ({
  musicEvent,
}: {
  musicEvent: ClientMusicEvent;
}) => {
  return (
    <div className="flex flex-row mb-3">
      <MusicEventDate musicEvent={musicEvent} />
      <div className="flex flex-col sm:flex-row">
        <MusicEventVenue musicEvent={musicEvent} />
        <MusicEventArtists musicEvent={musicEvent} />
        <MusicEventLink musicEvent={musicEvent} />
      </div>
    </div>
  );
};

const MusicEventDate = ({ musicEvent }: { musicEvent: ClientMusicEvent }) => {
  const dateParts = DateHelper.extractParts(musicEvent.startDateTime);

  return (
    <div className="mr-2 sm:mr-5 sm:w-32">
      <div className="flex flex-col sm:flex-row">
        <span className="mr-2">{dateParts.timeStr}</span>
        <div className="flex flex-col">
          {DateHelper.isRecent(musicEvent.createdAt) && (
            <span className="text-blue-400 mr-2">NEW</span>
          )}
          {musicEvent.isFree && <span className="text-yellow-400">FREE</span>}
        </div>
      </div>
    </div>
  );
};

const MusicEventVenue = ({ musicEvent }: { musicEvent: ClientMusicEvent }) => {
  return (
    <div className="mr-2 sm:mr-5 sm:w-32">
      <div>
        <Image
          src="/icons/location.svg"
          alt="Venue name"
          width={16}
          height={16}
          className="inline mr-1"
        />
        <a
          href={`https://www.instagram.com/${musicEvent.venue?.instagramUsername}`}
          className="hover:underline"
        >
          {musicEvent.venue?.name}
        </a>
      </div>
    </div>
  );
};
const MusicEventArtists = ({
  musicEvent,
}: {
  musicEvent: ClientMusicEvent;
}) => {
  return (
    <div className="sm:mr-5 sm:w-60">
      <Image
        src="/icons/music-note.svg"
        alt="Music artist names"
        width={16}
        height={16}
        className="inline mr-1"
      />
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
  );
};
const MusicEventLink = ({ musicEvent }: { musicEvent: ClientMusicEvent }) => {
  return (
    <div>
      <a
        className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        href={musicEvent.link}
      >
        link
      </a>
    </div>
  );
};
