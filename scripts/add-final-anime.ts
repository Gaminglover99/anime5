import { db } from '../server/db';
import { animes, genres, animeGenres, seasons, episodes, videoSources } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Final batch of anime to add
const animeData = [
  {
    title: "Cowboy Bebop",
    description: "The futuristic adventures of an easy-going bounty hunter and his partners.",
    type: "TV",
    status: "Completed",
    releaseYear: 1998,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg",
    genres: [1, 3, 10], // Action, Comedy, Sci-Fi
    seasons: [
      {
        number: 1,
        title: "Complete Series",
        episodes: [
          { number: 1, title: "Asteroid Blues", thumbnail: "https://m.media-amazon.com/images/M/MV5BZDUxMWU4NmYtODhlMi00MGUzLWI4MTItYTdmZGJjNzFhNzgzXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 2, title: "Stray Dog Strut", thumbnail: "https://m.media-amazon.com/images/M/MV5BYjcyOTk5ODItMDVkOC00NmUwLTlkMGUtZGY2Mjg4YTkxMjYyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Naruto",
    description: "Naruto Uzumaki, an adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
    type: "TV",
    status: "Completed",
    releaseYear: 2002,
    rating: 8.3,
    coverImage: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
    genres: [1, 2, 3], // Action, Adventure, Comedy
    seasons: [
      {
        number: 1,
        title: "Introduction Arc",
        episodes: [
          { number: 1, title: "Enter: Naruto Uzumaki!", thumbnail: "https://m.media-amazon.com/images/M/MV5BZDg5Zjk5YTktMzg5ZC00YTQxLWE1YTAtZjI1NWZmZDRjZGQ2XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
          { number: 2, title: "My Name is Konohamaru!", thumbnail: "https://m.media-amazon.com/images/M/MV5BODkxMzQ0NDItZWIwZC00ODYyLWIxMWItNzFiZGZjOTlmYTk5XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Tokyo Ghoul",
    description: "A Tokyo college student is attacked by a ghoul, a superpowered human who feeds on human flesh. He survives, but has become part ghoul and becomes a fugitive on the run.",
    type: "TV",
    status: "Completed",
    releaseYear: 2014,
    rating: 8.0,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/64449.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/64449l.jpg",
    genres: [1, 6, 13], // Action, Drama, Supernatural
    seasons: [
      {
        number: 1,
        title: "Season 1",
        episodes: [
          { number: 1, title: "Tragedy", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQzODg1MzU5NF5BMl5BanBnXkFtZTgwNzMwMjY2MjE@._V1_.jpg" },
          { number: 2, title: "Incubation", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjA1OTc4ODg3NF5BMl5BanBnXkFtZTgwODMwMjY2MjE@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Violet Evergarden",
    description: "In the aftermath of a great war, Violet Evergarden, a young female ex-soldier, gets a job at a writers' agency and goes on assignments to create letters that can connect people.",
    type: "TV",
    status: "Completed",
    releaseYear: 2018,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/1795/95088.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg",
    genres: [6, 4, 5], // Drama, Romance, Fantasy
    seasons: [
      {
        number: 1,
        title: "Series",
        episodes: [
          { number: 1, title: "I Love You and Auto Memory Dolls", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTUzZTQ1YTYtZGY0Ny00ZDkyLTg4YzgtMGJlZDlhMzA3YzVlXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" },
          { number: 2, title: "Never Coming Back", thumbnail: "https://m.media-amazon.com/images/M/MV5BNzNkMmM4OTAtYTFhNy00NzBlLWI0M2ItZDBmMmIxZWYxNmM1XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Your Lie in April",
    description: "A piano prodigy who lost his ability to play after suffering a traumatic event in his childhood is forced back into the spotlight by an eccentric girl with a secret of her own.",
    type: "TV",
    status: "Completed",
    releaseYear: 2014,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/3/67177.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/67177l.jpg",
    genres: [6, 4, 8], // Drama, Romance, Music
    seasons: [
      {
        number: 1,
        title: "Complete Series",
        episodes: [
          { number: 1, title: "Monotone/Colorful", thumbnail: "https://m.media-amazon.com/images/M/MV5BNWE0NTVkNGMtZjNkNC00ZDgzLWIwYWUtMWFhMjQ4MjdlZjNlXkEyXkFqcGdeQXVyMjI5MjU5OTI@._V1_.jpg" },
          { number: 2, title: "Friend A", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMyMzk3OTYtM2MzZC00MWVkLWJlN2UtY2JiODdjM2I5NzZlXkEyXkFqcGdeQXVyMjI5MjU5OTI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Code Geass",
    description: "After being given a mysterious power to control others, an outcast prince becomes the masked leader of the rebellion against an all powerful empire.",
    type: "TV",
    status: "Completed",
    releaseYear: 2006,
    rating: 8.7,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/50331.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/50331l.jpg",
    genres: [1, 6, 10], // Action, Drama, Sci-Fi
    seasons: [
      {
        number: 1,
        title: "Lelouch of the Rebellion",
        episodes: [
          { number: 1, title: "The Day a New Demon was Born", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTMwNjQ5NjQxN15BMl5BanBnXkFtZTcwMDc5OTQyNw@@._V1_.jpg" },
          { number: 2, title: "The White Knight Awakens", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjAzMDA2NTg2Nl5BMl5BanBnXkFtZTcwNzE5OTQyNw@@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Dragon Ball Z",
    description: "After learning that he is from another planet, a warrior named Goku and his friends are prompted to defend it from an onslaught of extraterrestrial enemies.",
    type: "TV",
    status: "Completed",
    releaseYear: 1989,
    rating: 8.5,
    coverImage: "https://cdn.myanimelist.net/images/anime/1607/117271.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1607/117271l.jpg",
    genres: [1, 2, 5], // Action, Adventure, Fantasy
    seasons: [
      {
        number: 1,
        title: "Saiyan Saga",
        episodes: [
          { number: 1, title: "The New Threat", thumbnail: "https://m.media-amazon.com/images/M/MV5BMGMyOThiMGUtYmFmZi00YWM0LWJiM2QtZGMwM2Q2ODE4MzhhXkEyXkFqcGdeQXVyMjc2Nzg5OTQ@._V1_.jpg" },
          { number: 2, title: "Reunions", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMwMDU1MjE1OV5BMl5BanBnXkFtZTgwNzk0NDQ1MjE@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Bleach",
    description: "High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to save the world from 'Hollows'.",
    type: "TV",
    status: "Completed",
    releaseYear: 2004,
    rating: 8.2,
    coverImage: "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/3/40451l.jpg",
    genres: [1, 2, 13], // Action, Adventure, Supernatural
    seasons: [
      {
        number: 1,
        title: "Agent of the Shinigami Arc",
        episodes: [
          { number: 1, title: "The Day I Became a Shinigami", thumbnail: "https://m.media-amazon.com/images/M/MV5BZjE4ODM5OTgtY2NkYS00ZTk5LTg1M2QtYTM1ZmZmOWE1YWM0XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 2, title: "The Shinigami's Work", thumbnail: "https://m.media-amazon.com/images/M/MV5BNDdiYTNhYmEtYzVlZi00MTQ4LWIzYzItMjcyMDVhYTlkZTQyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Haikyuu!!",
    description: "High school student Shoyo Hinata is determined to become a great volleyball player despite his small stature.",
    type: "TV",
    status: "Completed",
    releaseYear: 2014,
    rating: 8.7,
    coverImage: "https://cdn.myanimelist.net/images/anime/7/76014.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/7/76014l.jpg",
    genres: [3, 7, 12], // Comedy, Sports, School
    seasons: [
      {
        number: 1,
        title: "Season 1",
        episodes: [
          { number: 1, title: "Endings and Beginnings", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjA1MjA0MjYyOV5BMl5BanBnXkFtZTgwMDUxMjY2MjE@._V1_.jpg" },
          { number: 2, title: "The View From the Top", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjI1OTAxNTAyMl5BMl5BanBnXkFtZTgwNTQxMjY2MjE@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Sword Art Online",
    description: "In the year 2022, thousands of players get trapped in a new virtual MMORPG and the lone wolf player, Kirito, works to escape.",
    type: "TV",
    status: "Ongoing",
    releaseYear: 2012,
    rating: 7.6,
    coverImage: "https://cdn.myanimelist.net/images/anime/11/39717.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/11/39717l.jpg",
    genres: [1, 2, 4], // Action, Adventure, Romance
    seasons: [
      {
        number: 1,
        title: "Aincrad Arc",
        episodes: [
          { number: 1, title: "The World of Swords", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQxOTQ0MjEwMF5BMl5BanBnXkFtZTgwMTk3MTgwMjE@._V1_.jpg" },
          { number: 2, title: "Beater", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTUzNzgxOTgwMl5BMl5BanBnXkFtZTgwMjk3MTgwMjE@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Neon Genesis Evangelion",
    description: "A teenage boy finds himself recruited as a member of an elite team of pilots by his father.",
    type: "TV",
    status: "Completed",
    releaseYear: 1995,
    rating: 8.5,
    coverImage: "https://cdn.myanimelist.net/images/anime/1314/108941.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1314/108941l.jpg",
    genres: [1, 6, 10], // Action, Drama, Sci-Fi
    seasons: [
      {
        number: 1,
        title: "Complete Series",
        episodes: [
          { number: 1, title: "Angel Attack", thumbnail: "https://m.media-amazon.com/images/M/MV5BZjJhNTBmMTMtZDA0Ni00MDY4LWJlMDEtNmRlOTY3M2YwZGZlXkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_.jpg" },
          { number: 2, title: "The Beast", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQ4OTY2MTMxNV5BMl5BanBnXkFtZTcwNTM0MjIyMQ@@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Your Name",
    description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
    type: "Movie",
    status: "Completed",
    releaseYear: 2016,
    rating: 9.0,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/87048l.jpg",
    genres: [4, 6, 13], // Romance, Drama, Supernatural
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Your Name", thumbnail: "https://m.media-amazon.com/images/M/MV5BNGYyNmI3M2YtNzYzZS00OTViLTkxYjAtZDIyZmE1Y2U1ZmQ2XkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Spirited Away",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    type: "Movie",
    status: "Completed",
    releaseYear: 2001,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/6/79597.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/6/79597l.jpg",
    genres: [2, 5, 13], // Adventure, Fantasy, Supernatural
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Spirited Away", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Princess Mononoke",
    description: "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.",
    type: "Movie",
    status: "Completed",
    releaseYear: 1997,
    rating: 8.8,
    coverImage: "https://cdn.myanimelist.net/images/anime/7/75919.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/7/75919l.jpg",
    genres: [1, 2, 5], // Action, Adventure, Fantasy
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Princess Mononoke", thumbnail: "https://m.media-amazon.com/images/M/MV5BNGIzY2IzODQtNThmMi00ZDE4LWI5YzAtNzNlZTM1ZjYyYjUyXkEyXkFqcGdeQXVyODEzNjM5OTQ@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Weathering With You",
    description: "A high school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.",
    type: "Movie",
    status: "Completed",
    releaseYear: 2019,
    rating: 8.3,
    coverImage: "https://cdn.myanimelist.net/images/anime/1880/101146.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1880/101146l.jpg",
    genres: [5, 4, 13], // Fantasy, Romance, Supernatural
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Weathering With You", thumbnail: "https://m.media-amazon.com/images/M/MV5BNzE4ZDEzOGUtYWFjNC00ODczLTljOGQtZGNjNzhjNjdjNjgzXkEyXkFqcGdeQXVyNzE5ODMwNzI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Kimi no Na wa",
    description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
    type: "Movie",
    status: "Completed",
    releaseYear: 2016,
    rating: 9.0,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/87048l.jpg",
    genres: [4, 6, 13], // Romance, Drama, Supernatural
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Kimi no Na wa", thumbnail: "https://m.media-amazon.com/images/M/MV5BNGYyNmI3M2YtNzYzZS00OTViLTkxYjAtZDIyZmE1Y2U1ZmQ2XkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Howl's Moving Castle",
    description: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard and his companions in his legged, walking castle.",
    type: "Movie",
    status: "Completed",
    releaseYear: 2004,
    rating: 8.7,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/75810.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/75810l.jpg",
    genres: [2, 5, 4], // Adventure, Fantasy, Romance
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Howl's Moving Castle", thumbnail: "https://m.media-amazon.com/images/M/MV5BNmM4YTFmMmItMGE3Yy00MmRkLTlmZGEtMzZlOTQzYjk3MzA2XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "A Silent Voice",
    description: "A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.",
    type: "Movie",
    status: "Completed",
    releaseYear: 2016,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1122/96435l.jpg",
    genres: [4, 6, 12], // Romance, Drama, School
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "A Silent Voice", thumbnail: "https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTUtZTBhYS00NzI3LWEzMDQtOWRhMmNjNjJjMzM4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Grave of the Fireflies",
    description: "A young boy and his little sister struggle to survive in Japan during World War II.",
    type: "Movie",
    status: "Completed",
    releaseYear: 1988,
    rating: 8.5,
    coverImage: "https://cdn.myanimelist.net/images/anime/1/33327.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1/33327l.jpg",
    genres: [6, 14], // Drama, War
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "Grave of the Fireflies", thumbnail: "https://m.media-amazon.com/images/M/MV5BZmY2NjUzNDQtNTgxNC00M2Q4LTljOWQtMjNjNDBjNWUxNmJlXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "My Neighbor Totoro",
    description: "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.",
    type: "Movie",
    status: "Completed",
    releaseYear: 1988,
    rating: 8.3,
    coverImage: "https://cdn.myanimelist.net/images/anime/4/75923.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/4/75923l.jpg",
    genres: [2, 5, 3], // Adventure, Fantasy, Comedy
    seasons: [
      {
        number: 1,
        title: "Movie",
        episodes: [
          { number: 1, title: "My Neighbor Totoro", thumbnail: "https://m.media-amazon.com/images/M/MV5BYzJjMTYyMjQtZDI0My00ZjE2LTkyNGYtOTllNGQxNDMyZjE0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" }
        ]
      }
    ]
  }
];

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // If already an embed URL, return as is
  if (url.includes('embed')) {
    return url;
  }
  
  // Convert standard YouTube URL to embed URL
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return url;
}

async function main() {
  console.log("Starting to add final anime to reach 30 titles...");
  
  // Get current anime count
  const existingAnimeCount = await db.select().from(animes).limit(100);
  console.log(`Current anime count: ${existingAnimeCount.length}`);
  
  // Get all existing genres
  const existingGenres = await db.select().from(genres);
  console.log(`Found ${existingGenres.length} existing genres`);
  
  // Loop through each anime and add it to the database
  let animeAdded = 0;
  const targetCount = 30 - existingAnimeCount.length;
  
  for (const anime of animeData) {
    if (animeAdded >= targetCount) {
      console.log(`Reached target of ${targetCount} additional anime. Stopping.`);
      break;
    }
    
    try {
      console.log(`Processing anime: ${anime.title}`);
      
      // Check if anime already exists
      const existingAnime = await db.select().from(animes).where(eq(animes.title, anime.title));
      if (existingAnime.length > 0) {
        console.log(`Anime already exists: ${anime.title}, skipping...`);
        continue;
      }
      
      // Insert anime
      const [newAnime] = await db
        .insert(animes)
        .values({
          title: anime.title,
          description: anime.description,
          type: anime.type,
          status: anime.status,
          releaseYear: anime.releaseYear,
          rating: anime.rating,
          coverImage: anime.coverImage,
          bannerImage: anime.bannerImage,
        })
        .returning();
      
      console.log(`Added anime: ${newAnime.title} with ID: ${newAnime.id}`);
      
      // Add genre associations
      for (const genreId of anime.genres) {
        await db
          .insert(animeGenres)
          .values({
            animeId: newAnime.id,
            genreId: genreId,
          })
          .onConflictDoNothing();
      }
      
      console.log(`Added ${anime.genres.length} genres for anime: ${newAnime.title}`);
      
      // Add seasons and episodes
      for (const seasonData of anime.seasons) {
        // Add season
        const [newSeason] = await db
          .insert(seasons)
          .values({
            title: seasonData.title,
            number: seasonData.number,
            animeId: newAnime.id,
          })
          .returning();
        
        console.log(`Added season: ${newSeason.title} with ID: ${newSeason.id}`);
        
        // Add episodes for this season
        for (const episodeData of seasonData.episodes) {
          const [newEpisode] = await db
            .insert(episodes)
            .values({
              title: episodeData.title,
              number: episodeData.number,
              seasonId: newSeason.id,
              thumbnail: episodeData.thumbnail,
              description: `This is episode ${episodeData.number} of ${anime.title} - ${seasonData.title}.`,
            })
            .returning();
          
          console.log(`Added episode: ${newEpisode.title} with ID: ${newEpisode.id}`);
          
          // Add sample video sources for the episode
          // Watch URL (not downloadable)
          await db
            .insert(videoSources)
            .values({
              episodeId: newEpisode.id,
              url: getYouTubeEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"),
              quality: "HD",
              isDownloadable: false,
            });
          
          // Download URL
          await db
            .insert(videoSources)
            .values({
              episodeId: newEpisode.id,
              url: "https://example.com/download/episode.mp4",
              quality: "1080p",
              isDownloadable: true,
            });
        }
      }
      
      console.log(`Successfully added anime, seasons, episodes, and video sources for: ${anime.title}`);
      animeAdded++;
    } catch (error) {
      console.error(`Error adding anime: ${anime.title}`, error);
    }
  }
  
  console.log(`Finished adding ${animeAdded} anime to the database.`);
  console.log(`Total anime count should now be: ${existingAnimeCount.length + animeAdded}`);
}

main()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running script:", error);
    process.exit(1);
  });