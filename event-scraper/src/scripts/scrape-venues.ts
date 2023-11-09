import path from "path";
import fs from "fs";
import { NewVenue, VenueModel } from "../database/models/venue";
import { ReviewStatus } from "../utils/types";
import { InstagramService } from "../services/instagram.service";
import { logger } from "../utils/logger";

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
      logger.info({ country });

      const cityData = data[country];
      for (const city in cityData) {
        if (cityData.hasOwnProperty(city)) {
          const venueInstaUsernames = cityData[city];
          logger.info({ city, venues: venueInstaUsernames });

          await saveVenues(venueInstaUsernames, country, city);
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
  const venues = [];
  for (const venueUsername of venueInstaUsernames) {
    const savedVenue = await VenueModel.getOneByInstagramUsername(
      venueUsername
    );

    if (savedVenue) {
      logger.warn("Venue already exists in DB, skip", { venueUsername });
      continue;
    }

    const user = await InstagramService.fetchUser(venueUsername);
    if (!user) {
      logger.error(
        "Instagram username couldn't be found, should double check what the real one is"
      );
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

    venues.push(venue);
  }

  logger.info("saving venues...", { city, venues: venueInstaUsernames.length });

  try {
    await VenueModel.addMany(venues, true);

    logger.info("done saving venues...", { city });
  } catch (error) {
    logger.error("Error saving venues", error);
  }
};

main();
