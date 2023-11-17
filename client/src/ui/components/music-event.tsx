import React from "react";
import { ClientMusicEvent, ClientArtist } from "../../lib/database/db-manager";
import { DateHelper } from "../../lib/date.helper";
import Image from "next/image";
import { LocationIcon } from "../svgs/location-icon";
import { MusicNoteIcon } from "../svgs/music-note-icon";

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
            <span className="text-green-500 mr-2">NEW</span>
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
        <div className="inline-block mr-1">
          <LocationIcon />
        </div>
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
      <div className="inline-block mr-1">
        <MusicNoteIcon />
      </div>
      {musicEvent.artists.map((artist: ClientArtist, i: number) => (
        <React.Fragment key={artist.id}>
          <a
            href={`https://www.youtube.com/results?search_query=${artist.name}`}
            className="hover:underline"
          >
            {artist.name}
          </a>
          {i !== musicEvent.artists.length - 1 && <span>, </span>}
        </React.Fragment>
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
