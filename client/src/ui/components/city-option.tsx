"use client";

import { AppCity } from "@/lib/city";
import { useRouter } from "@/lib/navigation";

export const CityOption = ({
  city,
  displayText,
}: {
  city: AppCity;
  displayText: string;
}) => {
  const router = useRouter(); // TODO if we end up having a lot of cities maybe should push this to parent

  return (
    <div
      className="p-4 text-xl text-secondary hover:underline cursor-pointer"
      onClick={() => {
        // setDefaultCityCookie(city.toLowerCase());
        router.push(`/${city.toLowerCase()}`);
      }}
      key={city}
      data-umami-event="index-page-city-select"
      data-umami-event-city={city.toLowerCase()}
    >
      {displayText}
    </div>
  );
};
