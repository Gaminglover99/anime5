import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Anime } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Layers, ChevronLeft, ChevronRight } from "lucide-react";

const AdminSeasonsPage = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Fetch all animes
  const { data: animesResponse, isLoading } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
  });
  
  const animes = animesResponse?.data || [];
  
  // Filter animes by title
  const filteredAnimes = animes.filter(anime => 
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const totalItems = filteredAnimes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredAnimes.slice(startIndex, endIndex);
  
  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <AdminLayout title="Season & Episode Management">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Manage Seasons & Episodes</h1>
          
          <div className="relative w-full md:w-72">
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pr-10 focus:border-[#ff3a3a]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map(anime => (
                <Card key={anime.id} className="bg-[#222] border-gray-700 hover:border-[#ff3a3a] transition-colors overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-10 overflow-hidden rounded">
                        {anime.coverImage ? (
                          <img 
                            src={anime.coverImage} 
                            alt={anime.title} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x240?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium line-clamp-1" title={anime.title}>
                          {anime.title}
                        </CardTitle>
                        <div className="text-xs text-gray-400 mt-1">
                          {anime.type} • {anime.status}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="text-sm text-gray-300">
                      <span>{anime.releaseYear}</span>
                      {anime.duration && (
                        <span className="mx-2">•</span>
                      )}
                      <span>{anime.duration}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full bg-[#ff3a3a] hover:bg-red-700 text-white"
                      onClick={() => navigate(`/admin/anime/${anime.id}/simple-seasons`)}
                    >
                      Manage Seasons & Episodes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-[#222] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="px-4 py-2 rounded-md bg-[#222] border border-gray-700 text-gray-300">
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-[#222] border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        
        {!isLoading && filteredAnimes.length === 0 && (
          <div className="bg-[#222] rounded-lg p-8 text-center">
            <Layers className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Anime Found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "There are no anime available in the database."
              }
            </p>
            <Button 
              className="bg-[#ff3a3a] hover:bg-red-700 text-white"
              onClick={() => navigate("/admin/anime/new")}
            >
              Add New Anime
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSeasonsPage;