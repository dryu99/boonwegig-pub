export class DateHelper {
  private static readonly DAYS_OF_WEEK = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  public static extractParts(date: Date): {
    dayOfWeek: string;
    day: string;
    month: string;
    year: string;
    time: string;
  } {
    const dayOfWeek = this.getDayOfWeek(date.getDay());
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      dayOfWeek,
      day,
      month,
      year,
      time,
    };
  }

  public static isRecent(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInHours = diff / (1000 * 60 * 60);
    return diffInHours < 12;
  }

  // INVARIANT: dayOfWeek is 0-6, with 0 being Sunday
  private static getDayOfWeek(dayOfWeek: number): string {
    return this.DAYS_OF_WEEK[dayOfWeek];
  }
}
