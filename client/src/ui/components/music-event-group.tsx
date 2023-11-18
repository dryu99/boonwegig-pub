import { ClientMusicEvent } from "@/lib/database/db-manager";
import * as DateHelper from "@/lib/date.helper";
import { MusicEvent } from "./music-event";
import { StaticTranslations } from "@/lib/locale";

export const MusicEventGroup = ({
  groupDate,
  musicEvents,
  locale,
  translations,
}: {
  groupDate: Date;
  musicEvents: ClientMusicEvent[];
  locale: string;
  translations: StaticTranslations;
}) => {
  const groupDateParts = DateHelper.extractParts(groupDate, locale);

  return (
    <div className="mb-3">
      <div className="inline-block">
        <div>
          <span className="text-xl mr-1 font-bold align-middle">
            {groupDateParts.dateStr}
          </span>
          <span className="align-middle">({groupDateParts.dayOfWeek})</span>
        </div>
        <hr className="mb-2 " />
      </div>
      <div>
        {musicEvents.map((musicEvent, i) => (
          <MusicEvent
            key={musicEvent.link}
            musicEvent={musicEvent}
            translations={translations}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
};
