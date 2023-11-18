export type DateParts = {
  dayOfWeek: string;
  dateStr: string;
  timeStr: string;
};

// TODO prob better way to do this with next-intl, also theres duplication here with locale keys
// locale -> days of week strs
const localeToDaysOfWeekMap: Record<string, string[]> = {
  en: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
  ko: ["일", "월", "화", "수", "목", "금", "토"],
};

const DateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  month: "2-digit",
  day: "2-digit",
});

const TimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const extractParts = (date: Date, locale: string): DateParts => {
  const dateStr = DateFormatter.format(date);
  const timeStr = TimeFormatter.format(date);

  const daysOfWeek = localeToDaysOfWeekMap[locale];
  const dayOfWeek = daysOfWeek[date.getDay()];

  return {
    dayOfWeek,
    dateStr,
    timeStr,
  };
};

export const isRecent = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffInHours = diff / (1000 * 60 * 60);
  return diffInHours < 24;
};
