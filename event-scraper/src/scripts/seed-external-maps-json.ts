import { DatabaseManager } from "../database/db-manager";
import { VenueModel } from "../database/models/venue";
import { scrapeableVenues } from "../static/venues";

const main = async () => {
  DatabaseManager.start();

  for (const scrapeableVenue of scrapeableVenues) {
    const venueInstagramUsername = scrapeableVenue.instagramUsername;

    try {
      const savedVenue = await VenueModel.getOneByInstagramUsername(
        venueInstagramUsername
      );

      if (!savedVenue) {
        console.error("venue does not exist, skip", { venueInstagramUsername });
        continue;
      }

      // update venue with external maps json
      const updatedVenue = await VenueModel.updateOneByInstagramUsername(
        venueInstagramUsername,
        {
          externalMapsJson: JSON.stringify(scrapeableVenue.externalMapsJson),
        }
      );

      console.log("successfully updated venue", {
        updatedVenue: updatedVenue?.name,
        externalMapsJson: updatedVenue?.externalMapsJson,
      });
    } catch (error) {
      console.error("something went wrong, skip", {
        venue: scrapeableVenue,
      });
      console.error(error);
    }
  }

  process.exit();
};

main();
