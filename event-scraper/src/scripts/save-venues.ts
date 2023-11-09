import path from "path";
import fs from "fs";
import { NewVenue, VenueModel } from "../database/models/venue";
import { ReviewStatus } from "../utils/types";

const main = async () => {
  console.log(
    "Saving venues specified in venues.json... (will not save duplicate venues)"
  );
  const filePath = path.resolve(__dirname, `../static/venues.json`);

  const json = await fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(json);

  for (const country in data) {
    if (data.hasOwnProperty(country)) {
      console.log({ country });

      const cityData = data[country];
      for (const city in cityData) {
        if (cityData.hasOwnProperty(city)) {
          const venueInstaUsernames = cityData[city];
          console.log({ city, venues: venueInstaUsernames });

          await saveVenues(venueInstaUsernames, country, city);
        }
      }
    }
  }

  process.exit();
};

const saveVenues = async (
  venueInstaUsernames: string[],
  country: string,
  city: string
) => {
  const venues: NewVenue[] = venueInstaUsernames.map((venueUsername) => {
    return {
      name: venueUsername,
      city,
      country,
      reviewStatus: ReviewStatus.VALID,
      instagramUsername: venueUsername,
    };
  });

  console.log("saving venues...", { city, venues: venueInstaUsernames.length });

  try {
    await VenueModel.addMany(venues, true);

    console.log("done saving venues...", { city });
  } catch (error) {
    console.error("Error saving venues", error);
  }
};

main();
