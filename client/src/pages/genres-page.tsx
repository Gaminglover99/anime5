import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/layout/layout";

interface Genre {
  id: number;
  name: string;
  imageUrl?: string;
}

const GenresPage = () => {
  const { data: genres, isLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });

  // Default images for genres if they don't have one
  const getGenreImage = (genre: Genre) => {
    if (genre.imageUrl) return genre.imageUrl;
    
    // Default genre images based on genre name
    const defaultImages: Record<string, string> = {
      "Action": "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
      "Adventure": "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      "Comedy": "https://cdn.myanimelist.net/images/anime/4/50361.jpg",
      "Drama": "https://cdn.myanimelist.net/images/anime/1/89578.jpg",
      "Fantasy": "https://cdn.myanimelist.net/images/anime/11/39717.jpg",
      "Horror": "https://cdn.myanimelist.net/images/anime/5/10376.jpg",
      "Mystery": "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
      "Romance": "https://cdn.myanimelist.net/images/anime/1/122795.jpg",
      "Sci-Fi": "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
      "Slice of Life": "https://cdn.myanimelist.net/images/anime/1804/95033.jpg",
      "Sports": "https://cdn.myanimelist.net/images/anime/8/76508.jpg",
      "Supernatural": "https://cdn.myanimelist.net/images/anime/11/75274.jpg",
      "Psychological": "https://cdn.myanimelist.net/images/anime/5/64449.jpg",
      "Thriller": "https://cdn.myanimelist.net/images/anime/5/47347.jpg",
      "Historical": "https://cdn.myanimelist.net/images/anime/13/73834.jpg"
    };
    
    return defaultImages[genre.name] || "https://placehold.co/600x400/222/fff?text=" + genre.name;
  };

  return (
    <Layout>
      {/* Title handled by layout */}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Anime by Genre</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/2] bg-[#2D2D2D] rounded-lg mb-2"></div>
                <div className="h-5 bg-[#2D2D2D] rounded w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {genres?.map(genre => (
              <Link key={genre.id} href={`/genre/${genre.id}`}>
                <div className="relative rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105">
                  <div className="aspect-[3/2]">
                    <img 
                      src={getGenreImage(genre)} 
                      alt={`${genre.name} anime`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white px-4 py-2 rounded bg-black bg-opacity-60">
                      {genre.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenresPage;