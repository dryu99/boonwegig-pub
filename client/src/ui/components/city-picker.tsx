import { AppCity, CITIES } from "@/lib/city";
import { useRouter } from "@/lib/navigation";
import { courier } from "../fonts";
import { HeaderTranslations } from "@/lib/translation";
import { setDefaultCityCookie } from "@/lib/cookie-actions";

// TODO we should actually fetch curr location data in parent and pass into this component
//      we can do this by querying venue table, GROUP BY cities and just getting a list

export const CityPicker = ({
  initialCity,
  translations,
}: {
  initialCity: AppCity;
  translations: HeaderTranslations; // TODO theres def a better way to pass translations here
}) => {
  const router = useRouter();

  return (
    <div>
      <span>{"["}</span>
      <select
        id="city-picker"
        className={`text-lg appearance-none	bg-secondary text-center hover:underline cursor-pointer ${courier.className}`}
        value={initialCity.toLowerCase()}
        data-umami-event="city-picker-city-select"
        onChange={(e) => {
          setDefaultCityCookie(e.target.value);
          router.push(`/${e.target.value}`);
        }}
      >
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {translations[city].toUpperCase()}
          </option>
        ))}
      </select>
      <span>{"]"}</span>
    </div>
  );
};
