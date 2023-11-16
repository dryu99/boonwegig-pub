export type DateParts = {
  dayOfWeek: string;
  dateStr: string;
  timeStr: string;
};

// TODO ditch the class, use single export constants to reduce bundle size
export class DateHelper {
  public static readonly dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
  });

  public static readonly timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  private static readonly DAYS_OF_WEEK = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  public static extractParts(date: Date): DateParts {
    const dateStr = this.dateFormatter.format(date);
    const timeStr = this.timeFormatter.format(date);
    const dayOfWeek = this.getDayOfWeek(date.getDay());

    return {
      dayOfWeek,
      dateStr,
      timeStr,
    };
  }

  public static isRecent(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInHours = diff / (1000 * 60 * 60);
    return diffInHours < 24;
  }

  // INVARIANT: dayOfWeek is 0-6, with 0 being Sunday
  private static getDayOfWeek(dayOfWeek: number): string {
    return this.DAYS_OF_WEEK[dayOfWeek];
  }
}
