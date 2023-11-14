export const TimezoneOffsets: Record<string, string> = Object.freeze({
  seoul: "+09:00",
  busan: "+09:00",
  vancouver: "-08:00",
});

export const daysToSeconds = (days: number) => days * 24 * 60 * 60; // city is lowercase!!!
