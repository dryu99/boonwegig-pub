"use client";

import { useEffect, useState } from "react";
import { DateHelper, DateParts } from "../lib/date.helper";
import clsx from "clsx";

export const EventDate = ({ date }: { date: Date }) => {
  const [currDateParts, setCurrDateParts] = useState<DateParts | null>(null);

  useEffect(() => {
    // this fetches client date
    setCurrDateParts(DateHelper.extractParts(date));
  }, [date]);

  return (
    <div
      className={clsx({
        invisible: !currDateParts,
      })}
    >
      <span className="text-2xl mr-1 font-bold align-middle">
        {currDateParts?.month}/{currDateParts?.day}
      </span>
      <span className="align-middle">({currDateParts?.dayOfWeek})</span>
    </div>
  );
};

export const EventTime = ({ date }: { date: Date }) => {
  const [currDateParts, setCurrDateParts] = useState<DateParts | null>(null);

  useEffect(() => {
    // this fetches client date
    setCurrDateParts(DateHelper.extractParts(date));
  }, [date]);

  return (
    <div
      className={clsx({
        invisible: !currDateParts,
      })}
    >
      <span className="mr-2">{currDateParts?.time}</span>
      {/* {musicEvent.isFree && (
          <span className="text-yellow-400 mr-2">FREE</span>
        )} */}
      {/* {DateHelper.isRecent(musicEvent.createdAt) && (
          <span className="text-blue-400">New</span>
        )} */}
    </div>
  );
};
