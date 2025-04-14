import { db } from "../server/db";
import { animes, animeGenres, genres, seasons, episodes, videoSources } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

// Sample data for new animes
const animeData = [
  {
    title: "Hunter x Hunter",
    description: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and his potential, he seeks out his father, who left him when he was younger.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2011,
    rating: 9.1,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1337/111940.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1337/111940l.jpg",
    featured: true,
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2009,
    rating: 9.3,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    featured: true,
    genres: ["Action", "Adventure", "Drama", "Fantasy"]
  },
  {
    title: "One Punch Man",
    description: "The story of Saitama, a hero who can defeat any opponent with a single punch but seeks to find a worthy opponent.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2015,
    rating: 8.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
    featured: false,
    genres: ["Action", "Comedy", "Sci-Fi"]
  },
  {
    title: "Tokyo Ghoul",
    description: "A college student is attacked by a ghoul, a being that feeds on human flesh, and becomes a half-ghoul himself.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2014,
    rating: 7.9,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/5/64449.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/64449l.jpg",
    featured: false,
    genres: ["Action", "Horror", "Psychological", "Supernatural"]
  },
  {
    title: "Sword Art Online",
    description: "Players of a virtual reality MMORPG find themselves trapped in the game and must complete it to escape.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2012,
    rating: 7.5,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/11/39717.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/11/39717l.jpg",
    featured: false,
    genres: ["Action", "Adventure", "Romance", "Fantasy"]
  },
  {
    title: "Mob Psycho 100",
    description: "A psychic middle school boy tries to live a normal life and keep his powers hidden from others, despite constantly getting into trouble.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2016,
    rating: 8.6,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/8/80356.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/8/80356l.jpg",
    featured: false,
    genres: ["Action", "Comedy", "Supernatural"]
  },
  {
    title: "Cowboy Bebop",
    description: "A ragtag crew of bounty hunters chase down criminals in the galaxy.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 1998,
    rating: 8.8,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg",
    featured: false,
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"]
  },
  {
    title: "Violet Evergarden",
    description: "A former soldier becomes an Auto Memory Doll and learns to understand emotions and the meaning of love.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2018,
    rating: 8.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg",
    featured: false,
    genres: ["Drama", "Fantasy"]
  },
  {
    title: "Kimetsu no Yaiba: Mugen Train",
    description: "Tanjiro and his friends join the Flame Hashira Kyojuro Rengoku to face the demon aboard the Mugen Train.",
    type: "Movie" as const,
    status: "Completed" as const,
    releaseYear: 2020,
    rating: 8.7,
    duration: "1 hr 57 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1704/106947.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1704/106947l.jpg",
    featured: true,
    genres: ["Action", "Fantasy", "Adventure"]
  },
  {
    title: "Spy x Family",
    description: "A spy on an undercover mission gets married and adopts a child as part of his cover, not knowing his wife is an assassin and the child is a telepath.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2022,
    rating: 8.6,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg",
    featured: true,
    genres: ["Action", "Comedy"]
  }
];

// More animes to reach close to 100
const moreAnimeData = Array(85 - animeData.length).fill(null).map((_, index) => {
  const id = index + animeData.length + 1;
  return {
    title: `Custom Anime ${id}`,
    description: `This is a description for Custom Anime ${id}, featuring exciting adventures and interesting characters.`,
    type: ["TV", "Movie", "OVA", "Special"][Math.floor(Math.random() * 4)] as any,
    status: ["Ongoing", "Completed", "Upcoming"][Math.floor(Math.random() * 3)] as any,
    releaseYear: 2000 + Math.floor(Math.random() * 23),
    rating: (6 + Math.random() * 3).toFixed(1),
    duration: `${20 + Math.floor(Math.random() * 10)} min`,
    coverImage: `https://via.placeholder.com/225x318.png?text=Anime+${id}`,
    bannerImage: `https://via.placeholder.com/1920x1080.png?text=Anime+${id}+Banner`,
    featured: Math.random() > 0.9,
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Supernatural"]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 3))
  };
});

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createSeasonsAndEpisodes(animeId: number, type: string) {
  const promises = [];
  // For movies, create only one season with one episode
  const seasonCount = type === "Movie" ? 1 : getRandomInt(1, 3);
  
  for (let s = 1; s <= seasonCount; s++) {
    promises.push(async () => {
      // Create season
      const [season] = await db.insert(seasons).values({
        animeId,
        number: s,
        title: `Season ${s}`
      }).returning();
      
      // Create episodes
      const episodeCount = type === "Movie" ? 1 : getRandomInt(10, 24);
      for (let e = 1; e <= episodeCount; e++) {
        const episodeTitle = type === "Movie" 
          ? `${animeData[0].title}` 
          : `Episode ${e}`;
        
        const [episode] = await db.insert(episodes).values({
          seasonId: season.id,
          number: e,
          title: episodeTitle,
          description: `Description for ${episodeTitle}`,
          duration: type === "Movie" ? "90:00" : `${getRandomInt(20, 24)}:00`,
          thumbnail: animeData[0].coverImage
        }).returning();
        
        // Add video sources for each episode
        await db.insert(videoSources).values({
          episodeId: episode.id,
          quality: "360p",
          url: `https://example.com/video/${animeId}/${s}/${e}/360p.mp4`,
          isDownloadable: true
        });
        
        await db.insert(videoSources).values({
          episodeId: episode.id,
          quality: "720p",
          url: `https://example.com/video/${animeId}/${s}/${e}/720p.mp4`,
          isDownloadable: true
        });
      }
    });
  }
  
  return promises;
}

async function main() {
  try {
    console.log("Starting to fix duplicates and add more anime entries...");
    
    // Get existing anime titles
    const existingAnimes = await db.select().from(animes);
    console.log(`Found ${existingAnimes.length} existing anime entries.`);
    
    // Find and remove duplicates
    const uniqueTitles = new Set<string>();
    const duplicates: number[] = [];
    
    existingAnimes.forEach(anime => {
      if (uniqueTitles.has(anime.title)) {
        // This is a duplicate
        duplicates.push(anime.id);
      } else {
        uniqueTitles.add(anime.title);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate anime entries.`);
    
    // Remove duplicates if any
    if (duplicates.length > 0) {
      // First remove related genre connections
      for (const duplicateId of duplicates) {
        await db.delete(animeGenres).where(eq(animeGenres.animeId, duplicateId));
      }
      
      // Then remove the anime entries
      for (const duplicateId of duplicates) {
        await db.delete(animes).where(eq(animes.id, duplicateId));
      }
      
      console.log(`Deleted ${duplicates.length} duplicate anime entries.`);
    }
    
    // Get all genres for mapping
    const allGenres = await db.select().from(genres);
    console.log(`Found ${allGenres.length} genres in the database.`);
    
    // Create a map of genre names to IDs
    const genreMap: Record<string, number> = {};
    allGenres.forEach(genre => {
      genreMap[genre.name.toLowerCase()] = genre.id;
    });
    
    // Get updated list of existing anime titles after removing duplicates
    const updatedExistingAnimes = await db.select().from(animes);
    const existingTitles = new Set(updatedExistingAnimes.map(anime => anime.title));
    
    // Combine both anime data sets and filter out any that already exist
    const combinedAnimeData = [...animeData, ...moreAnimeData].filter(anime => !existingTitles.has(anime.title));
    console.log(`Adding ${combinedAnimeData.length} new anime entries...`);
    
    let addedCount = 0;
    let seasonsPromises = [];
    
    // Add each new anime
    for (const animeEntry of combinedAnimeData) {
      try {
        // Extract genres and remove from the anime data
        const genreNames = [...animeEntry.genres];
        const animeData = { ...animeEntry };
        delete (animeData as any).genres;
        
        // Create the anime
        const [anime] = await db.insert(animes).values(animeData).returning();
        console.log(`Created anime: ${anime.title}`);
        
        // Add genre relationships
        for (const genreName of genreNames) {
          const genreId = genreMap[genreName.toLowerCase()];
          if (genreId) {
            await db.insert(animeGenres).values({
              animeId: anime.id,
              genreId
            });
          }
        }
        
        // Create seasons and episodes (collect promises for later execution)
        const promises = createSeasonsAndEpisodes(anime.id, anime.type);
        seasonsPromises.push(...promises);
        
        addedCount++;
      } catch (error) {
        console.error(`Error adding anime ${animeEntry.title}:`, error);
      }
    }
    
    // Execute season and episode creation in batches to avoid overloading the database
    const BATCH_SIZE = 5;
    for (let i = 0; i < seasonsPromises.length; i += BATCH_SIZE) {
      const batch = seasonsPromises.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(promise => promise()));
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(seasonsPromises.length / BATCH_SIZE)}`);
    }
    
    console.log(`Successfully added ${addedCount} new anime entries with seasons and episodes!`);
    console.log("Fixed duplicates and added more content successfully!");
    
  } catch (error) {
    console.error("Error during fixing duplicates and adding animes:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();