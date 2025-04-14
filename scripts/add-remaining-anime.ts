import { db } from '../server/db';
import { animes, genres, animeGenres, seasons, episodes, videoSources } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Include only anime that weren't added in the previous script
const animeData = [
  {
    title: "Death Note",
    description: "A high school student discovers a supernatural notebook that grants its user the ability to kill anyone whose name and face they know.",
    type: "TV",
    status: "Completed",
    releaseYear: 2006,
    rating: 8.9,
    coverImage: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    genres: [6, 9, 13], // Drama, Mystery, Supernatural
    seasons: [
      {
        number: 1,
        title: "Season 1",
        episodes: [
          { number: 1, title: "Rebirth", thumbnail: "https://m.media-amazon.com/images/M/MV5BNDc1MjExMzItOGNiOC00YjI1LWI5ZTAtMjgwMGY0YmY0OWVlXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 2, title: "Confrontation", thumbnail: "https://m.media-amazon.com/images/M/MV5BYzEwOTFiZWYtZjk5Ni00MWUwLWE2ZjQtMGVlMDY3ZjYyYWJiXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 3, title: "Dealings", thumbnail: "https://m.media-amazon.com/images/M/MV5BOTc2YmQ0ZmUtYTcxYS00NDI2LTllNjQtZWY5NGNkODkxYTk2XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes wrong and leaves them in damaged physical forms.",
    type: "TV",
    status: "Completed",
    releaseYear: 2009,
    rating: 9.1,
    coverImage: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    genres: [1, 2, 6], // Action, Adventure, Drama
    seasons: [
      {
        number: 1,
        title: "Part 1",
        episodes: [
          { number: 1, title: "Fullmetal Alchemist", thumbnail: "https://m.media-amazon.com/images/M/MV5BNDc1MjExMzItOGNiOC00YjI1LWI5ZTAtMjgwMGY0YmY0OWVlXkEyXkFqcGdeQXVyMjc5OTMxMzQ@._V1_.jpg" },
          { number: 2, title: "The First Day", thumbnail: "https://m.media-amazon.com/images/M/MV5BODg3YWM3MmUtMDhjMC00ODI0LThlZjUtYTM4ZjJiZGJiNTRkXkEyXkFqcGdeQXVyMjc5OTMxMzQ@._V1_.jpg" },
          { number: 3, title: "City of Heresy", thumbnail: "https://m.media-amazon.com/images/M/MV5BYzdlNTIyZmYtZmQyOC00ZjU0LWJlMzYtMzQ0NmJlZjM5Zjc1XkEyXkFqcGdeQXVyMjc5OTMxMzQ@._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Part 2",
        episodes: [
          { number: 26, title: "Reunion", thumbnail: "https://m.media-amazon.com/images/M/MV5BNTJlMGQzMzctNjhlZS00YTcxLTg3MTgtMTQ0ZmJlZWNhZjNhXkEyXkFqcGdeQXVyMjc5OTMxMzQ@._V1_.jpg" },
          { number: 27, title: "Interlude Party", thumbnail: "https://m.media-amazon.com/images/M/MV5BNjIyZTdjNzItYWI5ZC00ZDJkLTkzZTAtZDZkYTJmODRlMjRhXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Hunter x Hunter",
    description: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. He believes that becoming a Hunter will lead him to finding his father, who left him when he was still young.",
    type: "TV",
    status: "Ongoing",
    releaseYear: 2011,
    rating: 9.0,
    coverImage: "https://cdn.myanimelist.net/images/anime/11/33657.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/11/33657l.jpg",
    genres: [1, 2, 5], // Action, Adventure, Fantasy
    seasons: [
      {
        number: 1,
        title: "Hunter Exam Arc",
        episodes: [
          { number: 1, title: "Departure × And × Friends", thumbnail: "https://m.media-amazon.com/images/M/MV5BNTZkM2QwZGItZDhhMy00ZjA0LWEzYWMtZWVmNjIwN2RkNmMyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 2, title: "Tests × Of × Tests", thumbnail: "https://m.media-amazon.com/images/M/MV5BZTI1YzI2OGQtOGJkMy00MjFhLTg3Y2ItZGY4NTg0MmZiY2Q5XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 3, title: "Rivals × In × Survival", thumbnail: "https://m.media-amazon.com/images/M/MV5BMzY4NTdjYjktMzAyMC00YTU4LWE3YTYtYmY2M2U2YWJmNjRkXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Heavens Arena Arc",
        episodes: [
          { number: 27, title: "Arrival × At × The Arena", thumbnail: "https://m.media-amazon.com/images/M/MV5BODM3YzFmMmQtNTJkNi00ZTg1LTk2MjQtNjE0YWMwMmY5MTA2XkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 28, title: "Nen × And × Nen", thumbnail: "https://m.media-amazon.com/images/M/MV5BYTcxZWUxNDUtMTM1OS00Nzg1LWE1ZjgtMzAxNTZmYTMyMmVkXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
        ]
      }
    ]
  },
  {
    title: "Steins;Gate",
    description: "A group of friends have customized their microwave into a device that can send text messages to the past. As they perform different experiments, an organization named SERN who has been doing their own research on time travel tracks them down.",
    type: "TV",
    status: "Completed",
    releaseYear: 2011,
    rating: 9.1,
    coverImage: "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
    bannerImage: "https://cdn.myanimelist.net/images/anime/5/73199l.jpg",
    genres: [6, 9, 10], // Drama, Mystery, Sci-Fi
    seasons: [
      {
        number: 1,
        title: "Original Series",
        episodes: [
          { number: 1, title: "Turning Point", thumbnail: "https://m.media-amazon.com/images/M/MV5BMDlhMDQ0MjYtYTVjNC00YjdmLWE4YzctYmExZGJiZWYxYzY4XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" },
          { number: 2, title: "Time Travel Paranoia", thumbnail: "https://m.media-amazon.com/images/M/MV5BODhjMTIyODctNDdmYi00ZGRjLWJkNTgtMjZkZGJjY2U5NzA0XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" },
          { number: 3, title: "Butterfly Effect's Divergence", thumbnail: "https://m.media-amazon.com/images/M/MV5BYzM1MThkZTgtZGFiNi00OTIyLTlmYjMtNTA1N2M0NzAxNzJiXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" }
        ]
      }
    ]
  },
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
          { number: 2, title: "Stray Dog Strut", thumbnail: "https://m.media-amazon.com/images/M/MV5BYjcyOTk5ODItMDVkOC00NmUwLTlkMGUtZGY2Mjg4YTkxMjYyXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
          { number: 3, title: "Honky Tonk Women", thumbnail: "https://m.media-amazon.com/images/M/MV5BNWVkYzJjNDItODQxOS00YjQ5LTk5ZjEtZGRjYzY2ZmM1YThkXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" }
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
          { number: 2, title: "My Name is Konohamaru!", thumbnail: "https://m.media-amazon.com/images/M/MV5BODkxMzQ0NDItZWIwZC00ODYyLWIxMWItNzFiZGZjOTlmYTk5XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
          { number: 3, title: "Sasuke and Sakura: Friends or Foes?", thumbnail: "https://m.media-amazon.com/images/M/MV5BYTJhODI0NjktMDM2Yy00ZWE1LWFmNDMtYzFlMTRiYzY0Y2NmXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Land of Waves Arc",
        episodes: [
          { number: 6, title: "A Dangerous Mission! Journey to the Land of Waves!", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQ3MDcwNTgyN15BMl5BanBnXkFtZTgwNTUwMDI2MjE@._V1_.jpg" },
          { number: 7, title: "The Assassin of the Mist!", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjE5NzE3MjYyM15BMl5BanBnXkFtZTgwMDkwMDI2MjE@._V1_.jpg" }
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
          { number: 2, title: "Incubation", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjA1OTc4ODg3NF5BMl5BanBnXkFtZTgwODMwMjY2MjE@._V1_.jpg" },
          { number: 3, title: "Dove", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTgzNzc3ODkwNF5BMl5BanBnXkFtZTgwNzA3Mjc2MjE@._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Tokyo Ghoul √A",
        episodes: [
          { number: 1, title: "New Surge", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjExNTg5NjU4OV5BMl5BanBnXkFtZTgwNTM3MDU2NDE@._V1_.jpg" },
          { number: 2, title: "Dancing Flowers", thumbnail: "https://m.media-amazon.com/images/M/MV5BNzMyNDI5Njc3MV5BMl5BanBnXkFtZTgwODM3MDU2NDE@._V1_.jpg" }
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
          { number: 2, title: "Never Coming Back", thumbnail: "https://m.media-amazon.com/images/M/MV5BNzNkMmM4OTAtYTFhNy00NzBlLWI0M2ItZDBmMmIxZWYxNmM1XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" },
          { number: 3, title: "May You Be an Exemplary Auto Memory Doll", thumbnail: "https://m.media-amazon.com/images/M/MV5BNTBkMmMzODUtMDdlNi00YmMyLThkZmMtNjI0MWQyN2E3Mzc0XkEyXkFqcGdeQXVyMzI2Mjc1NjQ@._V1_.jpg" }
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
          { number: 2, title: "Friend A", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMyMzk3OTYtM2MzZC00MWVkLWJlN2UtY2JiODdjM2I5NzZlXkEyXkFqcGdeQXVyMjI5MjU5OTI@._V1_.jpg" },
          { number: 3, title: "Inside Spring", thumbnail: "https://m.media-amazon.com/images/M/MV5BZWIzZDM2MjAtNmY5ZC00N2I2LTk2YmEtNDQ5MzE1ZTlmOWM0XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_.jpg" }
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
          { number: 2, title: "The White Knight Awakens", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjAzMDA2NTg2Nl5BMl5BanBnXkFtZTcwNzE5OTQyNw@@._V1_.jpg" },
          { number: 3, title: "The False Classmate", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjIwNTIzMTMxNF5BMl5BanBnXkFtZTcwODM5OTQyNw@@._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Lelouch of the Rebellion R2",
        episodes: [
          { number: 1, title: "The Day a Demon Awakens", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQyMTk0NTY0M15BMl5BanBnXkFtZTcwMzEzMzU0MQ@@._V1_.jpg" },
          { number: 2, title: "Plan for Independent Japan", thumbnail: "https://m.media-amazon.com/images/M/MV5BMTU5MDYyNDI5NV5BMl5BanBnXkFtZTcwMjQzMzU0MQ@@._V1_.jpg" }
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
          { number: 2, title: "Reunions", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMwMDU1MjE1OV5BMl5BanBnXkFtZTgwNzk0NDQ1MjE@._V1_.jpg" },
          { number: 3, title: "Unlikely Alliance", thumbnail: "https://m.media-amazon.com/images/M/MV5BMjMyNDI3NTgxNF5BMl5BanBnXkFtZTgwODU0NDQ1MjE@._V1_.jpg" }
        ]
      },
      {
        number: 2,
        title: "Frieza Saga",
        episodes: [
          { number: 36, title: "Touching Down", thumbnail: "https://m.media-amazon.com/images/M/MV5BZWVmMTU1ZTItYmY0MS00ZjNmLWEwOGYtYjQzYWRiYmM3YmU1XkEyXkFqcGdeQXVyMTU0ODI1NTA5._V1_.jpg" },
          { number: 37, title: "Plans for Departure", thumbnail: "https://m.media-amazon.com/images/M/MV5BODlmNmVkYzctNGE5ZS00MTljLTlmYzgtNWI2MmNhMzkyYWVkXkEyXkFqcGdeQXVyMjc2Nzg5OTQ@._V1_.jpg" }
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
  console.log("Starting to add remaining anime to the database...");
  
  // Get all existing genres
  const existingGenres = await db.select().from(genres);
  console.log(`Found ${existingGenres.length} existing genres`);
  
  // Loop through each anime and add it to the database
  for (const anime of animeData) {
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
    } catch (error) {
      console.error(`Error adding anime: ${anime.title}`, error);
    }
  }
  
  console.log("Finished adding anime to the database.");
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