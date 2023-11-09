import path from "path";
import fs from "fs";
import { NewVenue, VenueModel } from "../database/models/venue";
import { ReviewStatus } from "../utils/types";
import { InstagramService } from "../services/instagram.service";
import { logger } from "../utils/logger";
import { ErrorUtils } from "../utils/error";

// TODO consider changing json to just be a list instead of a map
const main = async () => {
  logger.info(
    "Saving venues specified in venues.json... (will not save duplicate venues)"
  );
  const filePath = path.resolve(__dirname, `../static/venues.json`);

  const json = await fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(json);

  for (const country in data) {
    if (data.hasOwnProperty(country)) {
      const cityData = data[country];
      for (const city in cityData) {
        if (cityData.hasOwnProperty(city)) {
          const venueInstaUsernames: string[] = cityData[city];
          logger.info("processing venues", {
            city,
            venues: venueInstaUsernames,
          });

          // divide up usernames into those that are new and those that need to be updated
          const newVenueUsernames: string[] = [];
          const updatedVenueUsernames: string[] = [];
          for (const venueUsername of venueInstaUsernames) {
            const savedVenue = await VenueModel.getOneByInstagramUsername(
              venueUsername
            );

            if (!savedVenue) {
              logger.debug("Venue not in DB, track", { venueUsername });
              newVenueUsernames.push(venueUsername);
              continue;
            }

            logger.debug("Venue in DB, check for updates", { venueUsername });
            const hasInstagramUserMetadata =
              savedVenue.name !== null &&
              savedVenue.name !== undefined &&
              savedVenue.name.length !== 0;
            if (hasInstagramUserMetadata) {
              logger.debug("Existing Venue has metadata, skip", {
                venueUsername,
              });
              continue;
            }

            logger.debug("Venue does not have insta user metadata, track", {
              venueUsername,
            });
            updatedVenueUsernames.push(venueUsername);
          }

          // run db queries
          newVenueUsernames.length > 0 &&
            (await saveVenues(newVenueUsernames, country, city));
          updatedVenueUsernames.length > 0 &&
            (await updateVenuesWithInstagramData(updatedVenueUsernames));
        }
      }
    }
  }

  process.exit();
};

// TODO can prob break this up better, rn it's scraping AND saving
const saveVenues = async (
  venueInstaUsernames: string[],
  country: string,
  city: string
) => {
  logger.info("saving venues", { venueInstaUsernames, country, city });
  const newVenues: NewVenue[] = [];

  for (const venueUsername of venueInstaUsernames) {
    const user = await InstagramService.fetchUser(venueUsername);
    if (!user) {
      logger.error("Insta username not found, double check");
      continue;
    }

    const venue: NewVenue = {
      name: user.name,
      instagramUsername: venueUsername,
      city,
      country,
      reviewStatus: ReviewStatus.VALID,
      businessAddressJson: user.businessAddressJson,
      businessEmail: user.businessEmail,
      businessPhoneNumber: user.businessPhoneNumber,
      externalLink: user.externalLink,
    };

    newVenues.push(venue);
  }

  logger.info("saving venues...", { city, venues: venueInstaUsernames.length });

  try {
    await VenueModel.addMany(newVenues, true);

    logger.info("done saving venues...", { city });
  } catch (error: any) {
    logger.error("Error saving venues", { error: ErrorUtils.toObject(error) });
  }
};

const updateVenuesWithInstagramData = async (venueInstaUsernames: string[]) => {
  logger.info("updating venues", { venueInstaUsernames });
  for (const venueUsername of venueInstaUsernames) {
    const user = await InstagramService.fetchUser(venueUsername);
    if (!user) {
      logger.error("Insta username not found, double check");
      continue;
    }

    const updatedVenue: Partial<NewVenue> = {
      name: user.name,
      businessAddressJson: user.businessAddressJson,
      businessEmail: user.businessEmail,
      businessPhoneNumber: user.businessPhoneNumber,
      externalLink: user.externalLink,
    };

    logger.info("updating venue", { updatedVenue, venueUsername });

    try {
      await VenueModel.updateOneByInstagramUsername(
        venueUsername,
        updatedVenue
      );
      logger.info("done updating venue", { venueUsername });
    } catch (error) {
      logger.error("Error updating venue", error);
    }
  }
};

main();
