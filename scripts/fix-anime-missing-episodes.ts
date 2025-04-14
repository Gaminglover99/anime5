import { db } from "../server/db";
import { animes, seasons, episodes, videoSources } from "../shared/schema";
import { eq, isNull, not } from "drizzle-orm";

async function main() {
  console.log("Starting to fix anime missing seasons and episodes...");

  // Get all animes
  const allAnimes = await db.select().from(animes);
  console.log(`Found ${allAnimes.length} anime titles in database`);

  // Process each anime
  for (const anime of allAnimes) {
    try {
      // Check if anime has any seasons
      const animeSeasons = await db.select().from(seasons).where(eq(seasons.animeId, anime.id));
      
      if (animeSeasons.length === 0) {
        console.log(`Anime "${anime.title}" (ID: ${anime.id}) has no seasons. Adding default season...`);
        
        // Create a default season
        const [newSeason] = await db.insert(seasons).values({
          animeId: anime.id,
          number: 1,
          title: anime.type === "Movie" ? "Full Movie" : "Season 1"
        }).returning();
        console.log(`Created season "${newSeason.title}" with ID: ${newSeason.id} for anime "${anime.title}"`);
        
        // Create a default episode
        const [newEpisode] = await db.insert(episodes).values({
          seasonId: newSeason.id,
          number: 1,
          title: anime.type === "Movie" ? anime.title : "Episode 1",
          description: anime.description || `First episode of ${anime.title}`,
          thumbnail: anime.coverImage,
          duration: anime.type === "Movie" ? "120:00" : "24:00"
        }).returning();
        console.log(`Created episode "${newEpisode.title}" with ID: ${newEpisode.id}`);
        
        // Add default video sources
        const qualities = ["480p", "720p", "1080p"];
        for (const quality of qualities) {
          await db.insert(videoSources).values({
            episodeId: newEpisode.id,
            quality,
            url: `https://example.com/videos/${anime.title.toLowerCase().replace(/\s+/g, "-")}/${quality}.mp4`,
            isDownloadable: true
          });
        }
        console.log(`Added video sources for "${anime.title}"`);
      } else {
        // Check if each season has episodes
        for (const season of animeSeasons) {
          const seasonEpisodes = await db.select().from(episodes).where(eq(episodes.seasonId, season.id));
          
          if (seasonEpisodes.length === 0) {
            console.log(`Season "${season.title}" (ID: ${season.id}) of anime "${anime.title}" has no episodes. Adding default episode...`);
            
            // Create a default episode
            const [newEpisode] = await db.insert(episodes).values({
              seasonId: season.id,
              number: 1,
              title: anime.type === "Movie" ? anime.title : `Episode 1`,
              description: anime.description || `First episode of ${anime.title}, Season ${season.number}`,
              thumbnail: anime.coverImage,
              duration: anime.type === "Movie" ? "120:00" : "24:00"
            }).returning();
            console.log(`Created episode "${newEpisode.title}" with ID: ${newEpisode.id}`);
            
            // Add default video sources
            const qualities = ["480p", "720p", "1080p"];
            for (const quality of qualities) {
              await db.insert(videoSources).values({
                episodeId: newEpisode.id,
                quality,
                url: `https://example.com/videos/${anime.title.toLowerCase().replace(/\s+/g, "-")}/s${season.number}e1-${quality}.mp4`,
                isDownloadable: true
              });
            }
            console.log(`Added video sources for "${anime.title}", Season ${season.number}, Episode 1`);
          } else {
            // Check if episodes have video sources
            for (const episode of seasonEpisodes) {
              const episodeSources = await db.select().from(videoSources).where(eq(videoSources.episodeId, episode.id));
              
              if (episodeSources.length === 0) {
                console.log(`Episode "${episode.title}" (ID: ${episode.id}) has no video sources. Adding default sources...`);
                
                // Add default video sources
                const qualities = ["480p", "720p", "1080p"];
                for (const quality of qualities) {
                  await db.insert(videoSources).values({
                    episodeId: episode.id,
                    quality,
                    url: `https://example.com/videos/${anime.title.toLowerCase().replace(/\s+/g, "-")}/s${season.number}e${episode.number}-${quality}.mp4`,
                    isDownloadable: true
                  });
                }
                console.log(`Added video sources for "${anime.title}", Season ${season.number}, Episode ${episode.number}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing anime "${anime.title}" (ID: ${anime.id}):`, error);
    }
  }
  
  console.log("Finished fixing anime missing seasons and episodes");
}

main().catch(console.error).finally(() => process.exit(0));