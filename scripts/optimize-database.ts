import { db, pool } from "../server/db";

async function main() {
  console.log("Starting database optimization...");
  
  try {
    // Add indexes to improve query performance
    console.log("Adding performance indexes...");
    
    // Index for anime search
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_animes_title ON animes (title);
    `);
    console.log("Created index on animes.title");
    
    // Index for anime by type and status
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_animes_type_status ON animes (type, status);
    `);
    console.log("Created composite index on animes.type and animes.status");
    
    // Index for episodes by seasonId
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON episodes (season_id);
    `);
    console.log("Created index on episodes.season_id");
    
    // Index for video sources by episodeId
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_video_sources_episode_id ON video_sources (episode_id);
    `);
    console.log("Created index on video_sources.episode_id");
    
    // Index for anime genres
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_anime_genres_anime_id ON anime_genres (anime_id);
      CREATE INDEX IF NOT EXISTS idx_anime_genres_genre_id ON anime_genres (genre_id);
    `);
    console.log("Created indexes for anime_genres");
    
    // Index for watchlist
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist (user_id);
    `);
    console.log("Created index on watchlist.user_id");
    
    // Index for favorites
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);
    `);
    console.log("Created index on favorites.user_id");
    
    // Index for watch progress
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_watch_progress_user_id ON watch_progress (user_id);
      CREATE INDEX IF NOT EXISTS idx_watch_progress_episode_id ON watch_progress (episode_id);
    `);
    console.log("Created indexes for watch_progress");
    
    // Optimize tables
    console.log("Vacuuming database to reclaim space and update statistics...");
    await pool.query("VACUUM ANALYZE;");
    console.log("Database vacuum complete");
    
    console.log("Database optimization completed successfully");
  } catch (error) {
    console.error("Error during database optimization:", error);
  }
}

main().catch(console.error).finally(() => process.exit(0));