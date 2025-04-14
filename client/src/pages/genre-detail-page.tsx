import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Layout from "@/components/layout/layout";
import AnimeCard from "@/components/AnimeCard";
import { Loader } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

interface Anime {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  rating: string;
  type: string;
  subbed: boolean;
  dubbed: boolean;
  isNew: boolean;
}

const GenreDetailPage = () => {
  const { id } = useParams();
  const genreId = Number(id);
  
  const { data: animes, isLoading: animesLoading } = useQuery<Anime[]>({
    queryKey: [`/api/animes?genreId=${genreId}`],
  });
  
  const { data: genre, isLoading: genreLoading } = useQuery<Genre>({
    queryKey: [`/api/genres/${genreId}`],
  });
  
  const isLoading = animesLoading || genreLoading;

  return (
    <Layout>
      {/* Title handled by layout */}
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader className="w-10 h-10 animate-spin text-[#ff3a3a]" />
          </div>
        ) : genre ? (
          <>
            <h1 className="text-3xl font-bold mb-6">{genre.name} Anime</h1>
            
            {animes && animes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {animes.map(anime => (
                  <AnimeCard
                    key={anime.id}
                    id={anime.id}
                    title={anime.title}
                    imageUrl={anime.imageUrl}
                    rating={anime.rating}
                    type={anime.type}
                    isNew={anime.isNew}
                    subbed={anime.subbed}
                    dubbed={anime.dubbed}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-gray-400">No anime found in this genre.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-400">Genre not found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenreDetailPage;