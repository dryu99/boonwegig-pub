import { NewVenue, VenueModel } from "../database/models/venue";
import { ReviewStatus } from "../utils/types";
import { InstagramService } from "../services/instagram.service";
import { logger } from "../utils/logger";
import { DatabaseManager } from "../database/db-manager";
import { scrapeableVenues } from "../static/venues";

const main = async () => {
  DatabaseManager.start();
  logger.info(
    "Scraping venues specified in venues.json... (will not save duplicate venues)"
  );

  const newVenues = [];
  for (const venue of scrapeableVenues) {
    if (venue.skip) {
      logger.info("venue was flagged to skip, skipping...");
      continue;
    }

    const savedVenue = await VenueModel.getOneByInstagramUsername(
      venue.instagramUsername
    );

    if (savedVenue) {
      logger.warn("Venue already exists in DB, skip", {
        insta: venue.instagramUsername,
      });
      continue;
    }

    try {
      const user = await InstagramService.fetchUser(venue.instagramUsername);
      if (!user) {
        logger.error("Instagram username could not be found online", {
          insta: venue.instagramUsername,
        });
        continue;
      }

      const name = user.name || venue.instagramUsername;
      const slug = name.toLowerCase().replace(/\s/g, "-");

      const newVenue: NewVenue = {
        name,
        slug,
        instagramUsername: venue.instagramUsername,
        instagramId: user.id,
        city: venue.city,
        country: venue.country,
        reviewStatus: ReviewStatus.PENDING,
        businessAddressJson: user.businessAddressJson,
        businessEmail: user.businessEmail,
        businessPhoneNumber: user.businessPhoneNumber,
        externalLink: user.externalLink,
        externalMapsJson: JSON.stringify(venue.externalMapsJson),
      };

      newVenues.push(newVenue);
    } catch (error: any) {
      logger.error("Error fetching instagram user, skip", {
        error: error.message,
      });
      continue;
    }
  }

  if (newVenues.length === 0) {
    logger.info("No new venues to save");
    return;
  }

  try {
    logger.info("saving venues", { newVenues: newVenues.length });
    await VenueModel.addMany(newVenues, true);
    logger.info("Done saving venues");
  } catch (error: any) {
    logger.error("Error saving venues", { error: error.message });
  }

  logger.info("Done scraping ALL venues");
  process.exit();
};

main();
