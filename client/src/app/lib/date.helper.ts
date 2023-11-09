export class DateHelper {
  private static readonly DAYS_OF_WEEK = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat",
  ];

  public static extractParts(date: Date): {
    dayOfWeek: string;
    day: number;
    month: number;
    time: string;
  } {
    const dayOfWeek = this.getDayOfWeek(date.getDay());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return {
      dayOfWeek,
      day,
      month,
      time,
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
