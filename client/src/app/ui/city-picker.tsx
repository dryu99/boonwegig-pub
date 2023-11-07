"use client";

import { useState } from "react";

export const CityPicker = () => {
  // TODO we should actually fetch curr location data in parent and pass into this component
  //      we can do this by querying venue table, GROUP BY cities and just getting a list
  const [currCity, setCurrCity] = useState("Seoul");
  return (
    <div>
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option selected value="seoul">
          Seoul
        </option>
        <option value="busan">Busan</option>
        <option value="vancouver">Vancouver</option>
      </select>
    </div>
  );
};
