import { db } from "../server/db";
import { animes, animeGenres, genres } from "../shared/schema";
import { eq } from "drizzle-orm";

// Final batch of animes to reach 100
const finalAnimeData = [
  {
    title: "Black Clover",
    description: "A young boy without magic abilities aspires to be the Wizard King in a world where magic is everything.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2017,
    rating: 7.2,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/2/88336.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/2/88336l.jpg",
    featured: false,
    genres: ["Action", "Comedy", "Fantasy"]
  },
  {
    title: "Psycho-Pass",
    description: "In a dystopian future where people's mental states can be measured, a police inspector works with a latent criminal to solve crimes.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2012,
    rating: 8.4,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/5/43399.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/43399l.jpg",
    featured: false,
    genres: ["Action", "Psychological", "Sci-Fi", "Thriller"]
  },
  {
    title: "Overlord",
    description: "A player gets trapped in a virtual reality game and decides to conquer the new world he now lives in.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2015,
    rating: 8.0,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/7/88019.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/7/88019l.jpg",
    featured: false,
    genres: ["Action", "Adventure", "Fantasy", "Supernatural"]
  },
  {
    title: "Re:Zero",
    description: "A shut-in is transported to a fantasy world where he discovers he has the ability to return from death.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2016,
    rating: 8.2,
    duration: "25 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1935/127974.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
    featured: false,
    genres: ["Drama", "Fantasy", "Psychological", "Thriller"]
  },
  {
    title: "Konosuba",
    description: "A boy who dies and is sent to a fantasy world forms a dysfunctional party with a goddess, an explosion-obsessed mage, and a masochistic crusader.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2016,
    rating: 8.1,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/8/77831.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/8/77831l.jpg",
    featured: false,
    genres: ["Adventure", "Comedy", "Fantasy"]
  },
  {
    title: "Dr. Stone",
    description: "After a mysterious event petrifies all humans, thousands of years pass before a genius scientist awakens and plans to restore civilization.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2019,
    rating: 8.3,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1613/102576.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1613/102576l.jpg",
    featured: false,
    genres: ["Adventure", "Comedy", "Sci-Fi"]
  },
  {
    title: "Fire Force",
    description: "A boy joins a special fire force that combats strange fires where victims are turned into living infernos called 'Infernals'.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2019,
    rating: 7.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1260/113589.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1260/113589l.jpg",
    featured: false,
    genres: ["Action", "Fantasy", "Sci-Fi", "Supernatural"]
  },
  {
    title: "The Rising of the Shield Hero",
    description: "A man is transported to another world to become a legendary hero but is betrayed and must rise from rock bottom.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2019,
    rating: 8.0,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1490/101365.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1490/101365l.jpg",
    featured: false,
    genres: ["Action", "Adventure", "Drama", "Fantasy"]
  },
  {
    title: "Kaguya-sama: Love is War",
    description: "Two geniuses each attempt to force the other to confess their love first, believing that whoever confesses will be at a disadvantage.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2019,
    rating: 8.4,
    duration: "25 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1295/106551.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1295/106551l.jpg",
    featured: false,
    genres: ["Comedy", "Psychological", "Romance"]
  },
  {
    title: "Food Wars!",
    description: "A talented young chef enrolls in an elite culinary school where food battles determine one's status.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2015,
    rating: 8.2,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/3/76432.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/76432l.jpg",
    featured: false,
    genres: ["Comedy", "Ecchi"]
  },
  {
    title: "Assassination Classroom",
    description: "A group of misfits are tasked with killing their alien teacher who destroyed part of the moon and threatens to destroy Earth.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2015,
    rating: 8.3,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/5/75639.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/75639l.jpg",
    featured: false,
    genres: ["Action", "Comedy"]
  },
  {
    title: "No Game No Life",
    description: "Siblings who are brilliant gamers are transported to a world where all conflicts are resolved through games.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2014,
    rating: 8.1,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1074/111944.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1074/111944l.jpg",
    featured: false,
    genres: ["Adventure", "Comedy", "Ecchi", "Fantasy"]
  }
];

async function main() {
  try {
    console.log("Starting to add final batch of anime entries...");
    
    // Get existing anime count
    const existingAnimes = await db.select().from(animes);
    console.log(`Found ${existingAnimes.length} existing anime entries.`);
    
    // Get all genres for mapping
    const allGenres = await db.select().from(genres);
    console.log(`Found ${allGenres.length} genres in the database.`);
    
    // Create a map of genre names to IDs
    const genreMap: Record<string, number> = {};
    allGenres.forEach(genre => {
      genreMap[genre.name.toLowerCase()] = genre.id;
    });
    
    // Get existing anime titles
    const existingTitles = new Set(existingAnimes.map(anime => anime.title));
    
    // Filter out any animes that already exist
    const newAnimeData = finalAnimeData.filter(anime => !existingTitles.has(anime.title));
    console.log(`Adding ${newAnimeData.length} new anime entries...`);
    
    let addedCount = 0;
    
    // Add each new anime
    for (const animeEntry of newAnimeData) {
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
          } else {
            console.log(`Genre not found: ${genreName}`);
          }
        }
        
        addedCount++;
      } catch (error) {
        console.error(`Error adding anime ${animeEntry.title}:`, error);
      }
    }
    
    console.log(`Successfully added ${addedCount} new anime entries!`);
    
    // Get final count
    const finalAnimes = await db.select().from(animes);
    console.log(`Final count: ${finalAnimes.length} anime entries in the database.`);
    
  } catch (error) {
    console.error("Error adding animes:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();