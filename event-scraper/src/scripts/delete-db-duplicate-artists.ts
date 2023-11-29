import { sql } from "kysely";
import { DatabaseManager } from "../database/db-manager";

const main = async () => {
  const db = DatabaseManager.db;

  db.transaction().execute(async (trx) => {
    // find duplicate artists
    const duplicateArtistCounts = await trx
      .selectFrom("musicArtist")
      .select(({ fn, val, ref }) => [
        sql`LOWER(musicArtist.name)`.as("lowerName"),
        fn.count("musicArtist.name").as("duplicateCount"),
      ])
      .groupBy(sql`LOWER(musicArtist.name)`)
      .having((eb) => eb.fn.count("name"), ">", 1)
      .execute();

    for (const duplicateArtistCount of duplicateArtistCounts) {
      const duplicateArtists = await trx
        .selectFrom("musicArtist")
        .select("id")
        .where(sql`LOWER(name)`, "=", duplicateArtistCount.lowerName)
        .execute();

      // let first artist be the merge one
      const mergeId = duplicateArtists.map((artist) => artist.id)[0];
      const duplicateArtistIds = duplicateArtists
        .map((artist) => artist.id)
        .slice(1);

      console.log({
        name: duplicateArtistCount.lowerName,
        mergeId,
        duplicateArtistIds,
        duplicateCount: duplicateArtists.length,
      });

      // update many-many table
      await trx
        .updateTable("musicEventArtists")
        .set({ artistId: mergeId })
        .where("artistId", "in", duplicateArtistIds)
        .execute();

      // delete duplicate artists
      await trx
        .deleteFrom("musicArtist")
        .where("id", "in", duplicateArtistIds)
        .execute();
    }
  });

  console.log("done");
  process.exit();
};

main();
