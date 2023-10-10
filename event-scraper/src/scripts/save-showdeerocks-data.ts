import path from "path";
import { DatabaseManager } from "../db/db-manager";
import fs from "fs";
import { NewVenue, VenueModel } from "../db/models/venue";
import { ReviewStatus } from "../utils/types";

const main = async () => {
  const filePath = path.resolve(__dirname, `../../../showdeerocks-data.json`);

  const json = await fs.readFileSync(filePath, "utf-8");
  const showdeerocksData = JSON.parse(json);

  const events: any[] = Object.values(showdeerocksData);

  const venueNames = events.map((event) => event.location);
  const uniqueVenueNames = venueNames.filter((venue, index) => {
    return venueNames.indexOf(venue) === index;
  });

  await saveVenues(uniqueVenueNames);
};

const saveVenues = async (venueNames: string[]) => {
  const venues: NewVenue[] = venueNames.map((venueName, i) => {
    return {
      name: venueName,
      city: "Seoul",
      country: "KR",
      reviewStatus: ReviewStatus.PENDING,
      instagramId: i.toString(),
    };
  });

  console.log("saving venues", venueNames.length);
  console.log("eg", venues.slice(0, 5));

  try {
    await VenueModel.addMany(venues);
  } catch (error) {
    console.error("Error saving venues", error);
  }
};

main();
