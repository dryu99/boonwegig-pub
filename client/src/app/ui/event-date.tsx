"use client";

import { DateHelper } from "../lib/date.helper";

export const EventDate = ({
  startDate,
  createDate,
}: {
  startDate: Date;
  createDate: Date;
}) => {
  // TODO fix issue where date is not aligned with other columns
  const dateParts = DateHelper.extractParts(startDate); // TODO i wonder if it'd be more optimal to call this in a server component
  return (
    <div className="flex-none p-1 w-36">
      <div>
        <span className="text-2xl font-bold">
          {dateParts.month}/{dateParts.day}
        </span>{" "}
        ({dateParts.dayOfWeek})
      </div>
      <div>
        <span className="mr-2">{dateParts.time}</span>
        {DateHelper.isRecent(createDate) && (
          <span className="text-blue-400">New</span>
        )}
      </div>
    </div>
  );
};
