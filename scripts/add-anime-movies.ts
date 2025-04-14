import { db } from '../server/db';
import { animes, animeGenres, seasons, episodes, videoSources } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Adding anime movies to the database...');
  
  // Array of popular anime movies
  const movies = [
    {
      title: 'Spirited Away',
      description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.',
      coverImage: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
      bannerImage: 'https://m.media-amazon.com/images/M/MV5BMTY4YWMzMTMtZjUyOS00OGY0LTljMGEtNTU4ZTY3Yjg4Njk4XkEyXkFqcGdeQXVyMTI3MDk3MzQ@._V1_.jpg',
      releaseYear: 2001,
      type: 'Movie',
      status: 'Completed',
      rating: 8.6,
      trailer: 'https://www.youtube.com/embed/ByXuk9QqQkk',
      genreIds: [5, 2, 10] // Fantasy, Adventure, Slice of Life
    },
    {
      title: 'Your Name',
      description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
      coverImage: 'https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_.jpg',
      bannerImage: 'https://m.media-amazon.com/images/M/MV5BYmMyZjE0OWUtYzZjYS00NzRkLTkyMzMtZWM3ZGQzZDE4YTQyXkEyXkFqcGdeQXVyMTQ3MjMyMTYz._V1_.jpg',
      releaseYear: 2016,
      type: 'Movie',
      status: 'Completed',
      rating: 8.8,
      trailer: 'https://www.youtube.com/embed/xU47nhruN-Q',
      genreIds: [8, 5, 9] // Romance, Fantasy, Sci-Fi
    },
    {
      title: 'A Silent Voice',
      description: 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.',
      coverImage: 'https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTUtZTBhYS00NzI3LWEzMDQtOWRhMmNjNjJjMzM4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
      bannerImage: 'https://m.media-amazon.com/images/M/MV5BMjA5ODgwODE0NV5BMl5BanBnXkFtZTgwNTI2OTUyMDI@._V1_.jpg',
      releaseYear: 2016,
      type: 'Movie',
      status: 'Completed',
      rating: 8.9,
      trailer: 'https://www.youtube.com/embed/nfK6UgLra7g',
      genreIds: [4, 8, 10] // Drama, Romance, Slice of Life
    },
    {
      title: 'Princess Mononoke',
      description: 'On a journey to find the cure for a Tatarigami\'s curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.',
      coverImage: 'https://m.media-amazon.com/images/M/MV5BNGIzY2IzODQtNThmMi00ZDE4LWI5YzAtNzNlZTM1ZjYyYjUyXkEyXkFqcGdeQXVyODEzNjM5OTQ@._V1_.jpg',
      bannerImage: 'https://m.media-amazon.com/images/M/MV5BMTY5OTkwNDkzOF5BMl5BanBnXkFtZTcwMzgzMTk2Mw@@._V1_.jpg',
      releaseYear: 1997,
      type: 'Movie',
      status: 'Completed',
      rating: 8.3,
      trailer: 'https://www.youtube.com/embed/4OiMOHRDs14',
      genreIds: [1, 2, 5] // Action, Adventure, Fantasy
    },
    {
      title: 'Weathering with You',
      description: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
      coverImage: 'https://m.media-amazon.com/images/M/MV5BNzE4ZDEzOGUtYWFjNC00ODczLTljOGQtZGNjNzhjNjdjNjgzXkEyXkFqcGdeQXVyNzE5ODMwNzI@._V1_.jpg',
      bannerImage: 'https://m.media-amazon.com/images/M/MV5BNWM0ZGJlMzMtZmYwMi00NzI3LTgzMzMtNjMzNjliNDRmZmFlXkEyXkFqcGdeQXVyMTQ3MjMyMTYz._V1_.jpg',
      releaseYear: 2019,
      type: 'Movie',
      status: 'Completed',
      rating: 7.5,
      trailer: 'https://www.youtube.com/embed/Q6iK6DjV_iE',
      genreIds: [5, 8, 4] // Fantasy, Romance, Drama
    }
  ];

  // Add each movie
  for (const movie of movies) {
    try {
      // Check if movie already exists
      const existingMovie = await db.select().from(animes).where(eq(animes.title, movie.title));
      
      if (existingMovie.length > 0) {
        console.log(`Movie already exists: ${movie.title}, skipping...`);
        continue;
      }
      
      // Insert movie
      const { genreIds, ...movieData } = movie;
      const [createdMovie] = await db.insert(animes).values(movieData).returning();
      console.log(`Added movie: ${movie.title} with ID: ${createdMovie.id}`);
      
      // Add genres
      if (genreIds && genreIds.length > 0) {
        for (const genreId of genreIds) {
          await db.insert(animeGenres).values({
            animeId: createdMovie.id,
            genreId
          });
        }
        console.log(`Added ${genreIds.length} genres for movie: ${movie.title}`);
      }
      
      // For movies, create a single 'Movie' season
      const [createdSeason] = await db.insert(seasons).values({
        animeId: createdMovie.id,
        title: 'Movie',
        number: 1,
        overview: `Full movie for ${movie.title}`
      }).returning();
      console.log(`Added movie season with ID: ${createdSeason.id}`);
      
      // Add a single episode representing the movie
      const [createdEpisode] = await db.insert(episodes).values({
        seasonId: createdSeason.id,
        number: 1,
        title: movie.title,
        description: movie.description,
        thumbnail: movie.coverImage,
        duration: 120, // Average movie length in minutes
      }).returning();
      console.log(`Added movie episode with ID: ${createdEpisode.id}`);
      
      // Add video sources - typically multiple quality options
      const qualities = ['480p', '720p', '1080p'];
      for (const quality of qualities) {
        await db.insert(videoSources).values({
          episodeId: createdEpisode.id,
          url: `https://example.com/movies/${movie.title.toLowerCase().replace(/\s+/g, '-')}/${quality}`,
          quality: quality,
          type: 'mp4'
        });
      }
      console.log(`Added video sources for ${movie.title}`);
      
      console.log(`Successfully added movie: ${movie.title}`);
    } catch (error) {
      console.error(`Error adding movie ${movie.title}:`, error);
    }
  }
  
  console.log('Finished adding anime movies to the database.');
}

main().catch(console.error).finally(() => process.exit(0));