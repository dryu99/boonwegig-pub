import { sql } from "kysely";
import { DatabaseManager } from "../database/db-manager";

const main = async () => {
  DatabaseManager.start();
  const db = DatabaseManager.db;

  try {
    const result = await db.transaction().execute(async (trx) => {
      // find duplicate artists
      const duplicateArtistCounts = await trx
        .selectFrom("musicArtist")
        .select(({ fn, val, ref }) => [
          sql`LOWER(music_artist.name)`.as("lowerName"),
          fn.count("musicArtist.name").as("duplicateCount"),
        ])
        .groupBy(sql`LOWER(music_artist.name)`)
        .having((eb) => eb.fn.count("name"), ">", 1)
        .execute();

      // for EACH artist find duplicates of artists
      for (const duplicateArtistCount of duplicateArtistCounts) {
        const duplicateArtists = await trx
          .selectFrom("musicArtist")
          .select("id")
          .where(sql`LOWER(name)`, "=", duplicateArtistCount.lowerName)
          .execute();

        const allDuplicateArtistIds = duplicateArtists.map(
          (artist) => artist.id
        );

        // find all event-artist pairs with duplicate artists
        const duplicateMusicEventArtistPairs = await trx
          .selectFrom("musicEventArtists")
          .selectAll()
          .where("artistId", "in", allDuplicateArtistIds)
          .execute();

        // find specific pairs where the SAME event has duplicate artists
        const pairsWithDuplicateEventIds =
          duplicateMusicEventArtistPairs.filter((pair, index, array) =>
            array.some((e, idx) => e.eventId === pair.eventId && idx !== index)
          );

        const keepPair = pairsWithDuplicateEventIds[0];
        const deletePairs = pairsWithDuplicateEventIds.slice(1);

        // delete pairs with same event id but duplicate artist ids
        for (const pair of deletePairs) {
          const result = await trx
            .deleteFrom("musicEventArtists")
            .where("artistId", "=", pair.artistId)
            .where("eventId", "=", pair.eventId)
            .execute();
          console.log("deleted duplicate event-artist pair", result);
        }

        const keepArtistId = allDuplicateArtistIds[0];
        const duplicateArtistIds = allDuplicateArtistIds.slice(1);

        console.log({
          name: duplicateArtistCount.lowerName,
          keepArtistId,
          duplicateArtistIds,
          duplicateCount: duplicateArtists.length,
          duplicateMusicEventArtistPairs,
          pairsWithDuplicateEventIds,
          keepPair,
        });

        // update many-many table
        await trx
          .updateTable("musicEventArtists")
          .set({ artistId: keepArtistId })
          .where("artistId", "in", duplicateArtistIds)
          .execute();

        // delete duplicate artists
        await trx
          .deleteFrom("musicArtist")
          .where("id", "in", duplicateArtistIds)
          .execute();
      }
    });

    console.log("done", result);
    await DatabaseManager.stop();
    process.exit();
  } catch (error) {
    console.error(error);
    await DatabaseManager.stop();
    process.exit(1);
  }
};

main();
