// use this script when you want to save events manually

import { DatabaseManager } from "../database/db-manager";
import {
  MusicEventModel,
  MusicEventType,
  ParsedMusicEvent,
} from "../database/models/music-event";
import { VenueModel } from "../database/models/venue";
import { InstagramPost } from "../services/instagram.service";
import { jebidabangMusicEvents } from "../static/2023-11-22_jebidabang-music-events";

const main = async () => {
  DatabaseManager.start();

  const savedVenue = await VenueModel.getOneByInstagramUsername("jebidabang");

  if (!savedVenue) {
    console.error("jebidabang venue not found in db");
    process.exit(1);
  }

  for (const musicEvent of jebidabangMusicEvents) {
    const parsedMusicEvent: ParsedMusicEvent = {
      startDateTime: musicEvent.startDateTime,
      isFree: true,
      musicArtists: musicEvent.musicArtists,
      eventType: MusicEventType.CONCERT,
    };

    const instagramPost: InstagramPost = {
      link: "https://www.ctrplus.com/jebi",
      createdAt: new Date("2023-11-23T05:00:00+09:00"),
      id: "test_id",
      username: "jebidabang",
    };

    const newMusicEvent = MusicEventModel.toNew(
      parsedMusicEvent,
      instagramPost,
      savedVenue
    );

    console.log("Saving music event", newMusicEvent);

    try {
      const savedMusicEvent = await MusicEventModel.addOneWithArtists(
        newMusicEvent
      );

      console.log("Done saving music event", savedMusicEvent);
    } catch (error) {
      console.error("Something went wrong saving music event", error);
    }
  }

  process.exit();
};

main();
