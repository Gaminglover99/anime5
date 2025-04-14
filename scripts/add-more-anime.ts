import { db } from "../server/db";
import { animes, animeGenres, genres } from "../shared/schema";
import { eq } from "drizzle-orm";

// Sample data for new animes
const moreAnimeData = [
  {
    title: "JoJo's Bizarre Adventure",
    description: "The story of the Joestar family, who are possessed with supernatural powers, and their battles against evil forces.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2012,
    rating: 8.5,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/3/40409.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/40409l.jpg",
    featured: false,
    genres: ["Action", "Adventure", "Supernatural"]
  },
  {
    title: "Neon Genesis Evangelion",
    description: "A teenage boy finds himself recruited as a pilot for a giant mech designed to defend Earth from mysterious beings called Angels.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 1995,
    rating: 8.5,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1314/108941.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1314/108941l.jpg",
    featured: false,
    genres: ["Action", "Drama", "Psychological", "Sci-Fi"]
  },
  {
    title: "Made in Abyss",
    description: "A young orphaned girl and a robot descend into the depths of the 'Abyss', facing dangers and uncovering its mysteries.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2017,
    rating: 8.7,
    duration: "25 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1557/136292.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1557/136292l.jpg",
    featured: false,
    genres: ["Adventure", "Drama", "Fantasy", "Mystery"]
  },
  {
    title: "Code Geass",
    description: "An exiled prince gains the power to control minds and uses it to lead a rebellion against the empire that conquered his homeland.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2006,
    rating: 8.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/5/50331.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/50331l.jpg",
    featured: false,
    genres: ["Action", "Drama", "Sci-Fi", "Mecha"]
  },
  {
    title: "Your Lie in April",
    description: "A piano prodigy who lost his ability to play after his mother's death meets a violinist who helps him return to music.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2014,
    rating: 8.7,
    duration: "22 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/67177l.jpg",
    featured: false,
    genres: ["Drama", "Romance", "Music"]
  },
  {
    title: "Vinland Saga",
    description: "A young Viking seeking revenge for his father's death finds himself on a journey that changes his perspective on life.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2019,
    rating: 8.8,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1500/103005l.jpg",
    featured: true,
    genres: ["Action", "Adventure", "Drama", "Historical"]
  },
  {
    title: "Death Parade",
    description: "When people die, they are sent to bartenders who determine whether their souls will be reincarnated or sent into the void.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2015,
    rating: 8.2,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/5/71553.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/71553l.jpg",
    featured: false,
    genres: ["Drama", "Mystery", "Psychological", "Supernatural"]
  },
  {
    title: "Mushoku Tensei",
    description: "A 34-year-old unemployed shut-in is reincarnated in a fantasy world after dying, resolving to live his new life without regrets.",
    type: "TV" as const,
    status: "Ongoing" as const,
    releaseYear: 2021,
    rating: 8.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1530/120304.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1530/120304l.jpg",
    featured: false,
    genres: ["Drama", "Fantasy", "Ecchi"]
  },
  {
    title: "Gintama",
    description: "In an era where aliens have invaded and taken over feudal Japan, a former samurai finds work as a freelancer alongside two friends.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2006,
    rating: 8.7,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/10/73274.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/10/73274l.jpg",
    featured: false,
    genres: ["Action", "Comedy", "Sci-Fi"]
  },
  {
    title: "Monster",
    description: "A talented neurosurgeon's life takes a turn when he chooses to save a young boy who grows up to be a dangerous serial killer.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2004,
    rating: 8.8,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/10/18793.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/10/18793l.jpg",
    featured: false,
    genres: ["Drama", "Horror", "Mystery", "Psychological", "Thriller"]
  },
  {
    title: "Clannad: After Story",
    description: "The continuation of the Clannad series, following the life of Tomoya after high school.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2008,
    rating: 8.9,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1299/110774.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1299/110774l.jpg",
    featured: false,
    genres: ["Drama", "Romance", "Supernatural"]
  },
  {
    title: "Gurren Lagann",
    description: "Two friends living in an underground village discover a mech and use it to fight their way to the surface and beyond.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2007,
    rating: 8.6,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/4/5123.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/4/5123l.jpg",
    featured: false,
    genres: ["Action", "Comedy", "Sci-Fi", "Mecha"]
  },
  {
    title: "Haikyu!!",
    description: "A high school volleyball team strives to make it to the national tournament through hard work and determination.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2014,
    rating: 8.7,
    duration: "25 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/7/76014.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/7/76014l.jpg",
    featured: false,
    genres: ["Comedy", "Drama", "Sports"]
  },
  {
    title: "Fruits Basket",
    description: "A kind high school girl discovers a family cursed to transform into animals of the Chinese zodiac when hugged by the opposite sex.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2019,
    rating: 8.6,
    duration: "23 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/1447/99827.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1447/99827l.jpg",
    featured: false,
    genres: ["Drama", "Romance", "Supernatural"]
  },
  {
    title: "Parasyte",
    description: "Alien parasites invade Earth and take over human hosts, but one fails to completely take over a high school student.",
    type: "TV" as const,
    status: "Completed" as const,
    releaseYear: 2014,
    rating: 8.4,
    duration: "24 min",
    coverImage: "https://cdn.myanimelist.net/images/anime/3/73178.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/73178l.jpg",
    featured: false,
    genres: ["Action", "Drama", "Horror", "Psychological", "Sci-Fi"]
  }
];

async function main() {
  try {
    console.log("Starting to add more anime entries...");
    
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
    const newAnimeData = moreAnimeData.filter(anime => !existingTitles.has(anime.title));
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