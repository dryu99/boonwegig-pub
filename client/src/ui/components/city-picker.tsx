// import { useState } from "react";

// TODO we should actually fetch curr location data in parent and pass into this component
//      we can do this by querying venue table, GROUP BY cities and just getting a list
const CITIES = ["seoul", "busan", "vancouver"];

// TODO selecting a city option should actually change the route shouldnt it...
export const CityPicker = ({ initialCity }: { initialCity: string }) => {
  // TODO get default value from users current location (use some browser api)
  // const [currCity, setCurrCity] = useState(initialCity);
  return (
    <div className="text-center">
      <h2>{initialCity}</h2>
      {/* <select
        className="text-xl underline bg-primary mb-4 text-center hover:cursor-pointer"
        style={{ appearance: "none" }}
        value={currCity}
        onChange={(e) => setCurrCity(e.target.value)}
      >
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city.toUpperCase()}
          </option>
        ))}
      </select> */}
    </div>
  );
};
