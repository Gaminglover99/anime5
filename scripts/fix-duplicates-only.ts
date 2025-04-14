import { db } from "../server/db";
import { animes, animeGenres, genres } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  try {
    console.log("Starting to fix duplicates...");
    
    // Get existing anime titles
    const existingAnimes = await db.select().from(animes);
    console.log(`Found ${existingAnimes.length} existing anime entries.`);
    
    // Create a map to track anime titles and their IDs
    const titleMap = new Map<string, number[]>();
    
    // Group animes by title
    existingAnimes.forEach(anime => {
      if (!titleMap.has(anime.title)) {
        titleMap.set(anime.title, []);
      }
      titleMap.get(anime.title)!.push(anime.id);
    });
    
    // Find titles with more than one entry
    const duplicateTitles: string[] = [];
    const duplicateIds: number[] = [];
    
    titleMap.forEach((ids, title) => {
      if (ids.length > 1) {
        duplicateTitles.push(title);
        // Keep the first ID, consider others as duplicates
        duplicateIds.push(...ids.slice(1));
      }
    });
    
    console.log(`Found ${duplicateIds.length} duplicate anime entries for ${duplicateTitles.length} titles.`);
    console.log("Duplicate titles:", duplicateTitles);
    
    // Remove duplicates if any
    if (duplicateIds.length > 0) {
      // First remove related genre connections
      for (const duplicateId of duplicateIds) {
        await db.delete(animeGenres).where(eq(animeGenres.animeId, duplicateId));
        console.log(`Deleted genre connections for anime ID ${duplicateId}`);
      }
      
      // Then remove the anime entries
      for (const duplicateId of duplicateIds) {
        await db.delete(animes).where(eq(animes.id, duplicateId));
        console.log(`Deleted duplicate anime ID ${duplicateId}`);
      }
      
      console.log(`Deleted ${duplicateIds.length} duplicate anime entries.`);
    } else {
      console.log("No duplicates found.");
    }
    
    // Verify the cleanup
    const remainingAnimes = await db.select().from(animes);
    console.log(`There are now ${remainingAnimes.length} anime entries in the database.`);
    
  } catch (error) {
    console.error("Error during fixing duplicates:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();