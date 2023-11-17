"use client";

import { ClientMusicEvent } from "@/lib/database/db-manager";
import { DateHelper } from "@/lib/date.helper";
import { MusicEvent } from "./music-event";
import { fetchMusicEvents } from "@/lib/actions";
import { useMemo, useState } from "react";
import { EVENTS_PER_LOAD } from "@/lib/constants";
import { LoaderIcon } from "../svgs/loader-icon";

export type MusicEventGroups = Record<string, ClientMusicEvent[]>;

export const MusicEvents = ({
  initialMusicEvents,
}: {
  initialMusicEvents: ClientMusicEvent[];
}) => {
  const [dbOffset, setDbOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreEvents, setHasMoreEventsLeft] = useState(
    initialMusicEvents.length >= EVENTS_PER_LOAD
  );
  const [musicEvents, setMusicEvents] =
    useState<ClientMusicEvent[]>(initialMusicEvents);

  // TODO we can optimize this by having the server calculate this on initial page load.
  //      currently its always being calculated on the client.
  const musicEventGroups = useMemo(() => {
    return musicEvents.reduce((acc, musicEvent) => {
      const key = `${musicEvent.startDateTime.getUTCMonth()}/${musicEvent.startDateTime.getUTCDate()}/${musicEvent.startDateTime.getUTCFullYear()}`;

      acc[key] ||= [];
      acc[key].push(musicEvent);
      return acc;
    }, {} as MusicEventGroups);
  }, [musicEvents]);

  const loadMore = async () => {
    setIsLoading(true);
    const newDbOffset = dbOffset + EVENTS_PER_LOAD;
    const newMusicEvents = await fetchMusicEvents({
      offset: newDbOffset,
    });

    if (newMusicEvents.length < EVENTS_PER_LOAD) {
      setHasMoreEventsLeft(false);
    }

    // TODO add error handling
    // TODO add loading state

    setDbOffset(newDbOffset);
    setMusicEvents([...musicEvents, ...newMusicEvents]);
    setIsLoading(false);
  };

  return (
    musicEvents && (
      <div>
        <div className="mb-10">
          {/* // TODO consider just using Object.keys here for perf */}
          {Object.entries(musicEventGroups).map(([date, musicEvents]) => (
            <MusicEventGroup
              key={date}
              groupDate={musicEvents[0].startDateTime}
              musicEvents={musicEvents}
            />
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <LoaderIcon />
          </div>
        ) : (
          hasMoreEvents && (
            <div className="text-center">
              <button
                onClick={() => loadMore()}
                // note: we use very specific y-margin here to line up so loader doesn't jump on btn click lol
                className="text-primary font-bold active:text-secondary my-[12px]"
              >
                <div>Load more</div>
                <hr className="border" />
              </button>
            </div>
          )
        )}
      </div>
    )
  );
};

const MusicEventGroup = ({
  groupDate,
  musicEvents,
}: {
  groupDate: Date;
  musicEvents: ClientMusicEvent[];
}) => {
  const groupDateParts = DateHelper.extractParts(groupDate);

  return (
    <div className="mb-3">
      <div>
        <span className="text-xl mr-1 font-bold align-middle">
          {groupDateParts.dateStr}
        </span>
        <span className="align-middle">({groupDateParts.dayOfWeek})</span>
      </div>
      <hr className="mb-2 w-28" />
      <div>
        {musicEvents.map((musicEvent, i) => (
          <MusicEvent key={musicEvent.link} musicEvent={musicEvent} />
        ))}
      </div>
    </div>
  );
};
