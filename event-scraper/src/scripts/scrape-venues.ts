import { VenueModel } from "../database/models/venue";
import { InstagramService } from "../services/instagram.service";
import { DatabaseManager } from "../database/db-manager";
import { scrapeableVenues } from "../static/venues";

const main = async () => {
  DatabaseManager.start();
  console.log(
    "Scraping venues specified in venues.json... (will not save duplicate venues)"
  );

  const newVenues = [];
  for (const venue of scrapeableVenues) {
    if (venue.skip) {
      console.log("venue was flagged to skip, skipping...");
      continue;
    }

    const savedVenue = await VenueModel.getOneByInstagramUsername(
      venue.instagramUsername
    );

    if (savedVenue) {
      console.warn("Venue already exists in DB, update metadata if diff", {
        insta: venue.instagramUsername,
      });

      const isDataSynced =
        JSON.stringify(venue.externalMapsJson) ===
        JSON.stringify(savedVenue.externalMapsJson);

      if (!isDataSynced) {
        console.log("venue metadata not synced, syncing...", {
          scrapeableVenue: venue,
          savedVenue,
        });
        await VenueModel.updateOneByInstagramUsername(venue.instagramUsername, {
          externalMapsJson: JSON.stringify(venue.externalMapsJson),
        });
      }

      continue;
    }

    try {
      const user = await InstagramService.fetchUser(venue.instagramUsername);
      if (!user) {
        console.error("Instagram username could not be found online", {
          insta: venue.instagramUsername,
        });
        continue;
      }

      const newVenue = VenueModel.toNew(user, venue);
      newVenues.push(newVenue);
    } catch (error: any) {
      console.error("Error fetching instagram user, skip", {
        error: error.message,
      });
      continue;
    }
  }

  if (newVenues.length === 0) {
    console.log("No new venues to save");
    return;
  }

  try {
    console.log("saving venues", { newVenues: newVenues.length });
    await VenueModel.addMany(newVenues, true);
    console.log("Done saving venues");
  } catch (error: any) {
    console.error("Error saving venues", { error: error.message });
  }

  console.log("Done scraping ALL venues");
  process.exit();
};

main();
