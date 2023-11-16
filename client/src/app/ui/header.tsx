import { CityPicker } from "./city-picker";

export const Header = () => {
  return (
    <div className="sm:text-center">
      <h1 className="text-2xl mt-3 mb-2 font-bold">BoonWeGig</h1>
      <CityPicker />
    </div>
  );
};
