import { NewVenue, VenueModel } from "../database/models/venue";
import { ReviewStatus } from "../utils/types";
import { InstagramService } from "../services/instagram.service";
import { logger } from "../utils/logger";
import { DatabaseManager } from "../database/db-manager";
import { VENUES } from "../static/venues";

const main = async () => {
  DatabaseManager.start();
  logger.info(
    "Scraping venues specified in venues.json... (will not save duplicate venues)"
  );

  for (const country in VENUES) {
    if (VENUES.hasOwnProperty(country)) {
      const cityData = VENUES[country];
      for (const city in cityData) {
        if (cityData.hasOwnProperty(city)) {
          const venueInstaUsernames = cityData[city];
          await saveVenues(venueInstaUsernames, country, city);
        }
      }
    }
  }

  logger.info("Done scraping ALL venues");
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

    try {
      const user = await InstagramService.fetchUser(venueUsername);
      if (!user) {
        logger.error("Instagram username could not be found online", {
          venueUsername,
        });
        continue;
      }

      const venue: NewVenue = {
        name: user.name,
        instagramUsername: venueUsername,
        instagramId: user.id,
        city,
        country,
        reviewStatus: ReviewStatus.VALID,
        businessAddressJson: user.businessAddressJson,
        businessEmail: user.businessEmail,
        businessPhoneNumber: user.businessPhoneNumber,
        externalLink: user.externalLink,
      };

      venues.push(venue);
    } catch (error: any) {
      logger.error("Error fetching instagram user, skip", {
        error: error.message,
      });
      continue;
    }
  }

  if (venues.length === 0) {
    logger.info("No new venues to save", { country, city });
    return;
  }

  try {
    logger.info("saving venues", { venueInstaUsernames, country, city });
    await VenueModel.addMany(venues, true);
    logger.info("Done saving venues", { venueInstaUsernames });
  } catch (error: any) {
    logger.error("Error saving venues", { error: error.message });
  }
};

main();
