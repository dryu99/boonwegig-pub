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
};

const saveVenues = async (venueNames: string[]) => {
  const venues: NewVenue[] = venueNames.map((venueName) => {
    return {
      name: venueName,
      reviewStatus: ReviewStatus.NEEDS_REVIEW,
    };
  });
  VenueModel.addMany();
};

main();
