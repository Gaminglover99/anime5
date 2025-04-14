import { useState } from "react";
import { useParams, useLocation } from "wouter";
import AdminLayout from "@/components/admin/admin-layout";
import EnhancedEpisodeManagement from "@/components/admin/enhanced-episode-management";
import { useQuery } from "@tanstack/react-query";
import { Anime } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EpisodeManagementPage = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const animeId = id ? parseInt(id) : undefined;
  
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | undefined>(animeId);
  
  // Fetch animes for dropdown when no anime ID is provided
  const { data: animeList, isLoading: isLoadingAnimes } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
    enabled: !animeId,
  });
  
  const animes = animeList?.data || [];
  
  const handleAnimeChange = (value: string) => {
    const newAnimeId = parseInt(value);
    setSelectedAnimeId(newAnimeId);
    navigate(`/admin/episode-management/${newAnimeId}`);
  };
  
  return (
    <AdminLayout title="Season & Episode Management">
      <div className="p-6">
        {!selectedAnimeId ? (
          <div className="bg-[#222] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">Select an Anime</h2>
            
            {isLoadingAnimes ? (
              <div className="flex justify-center p-4">
                <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="max-w-md">
                <Select
                  onValueChange={handleAnimeChange}
                  value={selectedAnimeId?.toString()}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a] w-full">
                    <SelectValue placeholder="Select an anime" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {animes.map((anime) => (
                      <SelectItem 
                        key={anime.id} 
                        value={anime.id.toString()}
                        className="text-white focus:bg-gray-700 focus:text-white"
                      >
                        {anime.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <Button
                    onClick={() => navigate("/admin/anime")}
                    variant="outline"
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white border-none"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Anime List</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EnhancedEpisodeManagement 
            animeId={selectedAnimeId} 
            onBack={() => navigate("/admin/anime")}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default EpisodeManagementPage;