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

  public static parseLocalDate(utcDate: string): {
    dayOfWeek: string;
    day: number;
    month: number;
    time: string;
  } {
    const date = new Date(utcDate);

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

  // INVARIANT: dayOfWeek is 0-6, with 0 being Sunday
  private static getDayOfWeek(dayOfWeek: number): string {
    return this.DAYS_OF_WEEK[dayOfWeek];
  }
}
