import { ClientMusicEvent } from "@/lib/database/db-manager";
import * as DateHelper from "@/lib/date.helper";
import { MusicEvent } from "./music-event";
import { AppLocale } from "@/lib/locale";
import { StaticTranslations } from "@/lib/translation";
import { courier } from "../fonts";
import { AppCity } from "@/lib/city";

export const MusicEventGroup = ({
  groupDate,
  musicEvents,
  locale,
  city,
  translations,
}: {
  groupDate: Date;
  musicEvents: ClientMusicEvent[];
  locale: AppLocale;
  city: AppCity;
  translations: StaticTranslations;
}) => {
  const groupDateParts = DateHelper.extractParts(groupDate, locale);

  return (
    <div className="mb-3">
      <div className="inline-block">
        <div>
          <span
            className={`text-xl mr-1 font-bold align-middle ${courier.className}`}
          >
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
            city={city}
          />
        ))}
      </div>
    </div>
  );
};
