import { Link } from "wouter";
import { Anime } from "@shared/schema";
import { Star, Play } from "lucide-react";

interface AnimeCardProps {
  anime: Anime;
  showRating?: boolean;
}

const AnimeCard = ({ anime, showRating = true }: AnimeCardProps) => {
  // Extract genres from anime for display
  const animeGenres = (anime as any).genres || [];
  // Get up to 2 genres to display
  const displayGenres = animeGenres.slice(0, 2).map((genre: any) => genre.name);
  
  return (
    <div className="relative group">
      <Link href={`/anime/${anime.id}`}>
        <div className="relative h-72 rounded-lg overflow-hidden cursor-pointer">
          <img
            src={anime.coverImage || ''} 
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          {/* Play overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300">
            <div className="h-12 w-12 rounded-full bg-[#ff3a3a]/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
          
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-[#ff3a3a] text-white text-xs font-medium rounded">
              {anime.type}
            </span>
          </div>
          
          {/* Rating */}
          {showRating && (
            <div className="absolute top-3 right-3 bg-black/60 px-1.5 py-0.5 rounded flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-white text-xs font-medium">
                {Number(anime.rating || 0).toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Bottom details overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-white text-md line-clamp-1">
              {anime.title}
            </h3>
            <div className="flex items-center text-xs text-gray-300 mt-1">
              <span className="text-xs text-white/80 bg-[#2a2a2a] px-2 py-0.5 rounded-sm mr-2">{anime.type}</span>
              {displayGenres.length > 0 && (
                displayGenres.map((genre: string, index: number) => (
                  <span key={index} className="text-xs text-white/80 mr-2">{genre}</span>
                ))
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;