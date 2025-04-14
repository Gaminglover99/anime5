import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '../lib/queryClient';
import Layout from '../components/layout/layout';
import { Genre, Anime } from '@shared/schema';
import AnimeCard from '../components/AnimeCard';
import { Spinner } from '../components/ui/spinner';
import { Button } from '../components/ui/button';
import { FilterX } from 'lucide-react';
import PageTitle from '../components/ui/page-title';
import { Badge } from '../components/ui/badge';

const GenresPage = () => {
  const [, setLocation] = useLocation();
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 24; // Items per page

  // Query for all genres
  const { data: genresData, isLoading: genresLoading } = useQuery<{data: Genre[]}>({
    queryKey: ['/api/genres'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/genres');
      return res.json();
    }
  });

  const genres = genresData?.data || [];

  // Query for animes by genre
  const { data: animesResponse, isLoading: animesLoading, error } = useQuery<{data: Anime[], total: number}>({
    queryKey: ['/api/animes', { genreId: selectedGenreId, page, limit }],
    queryFn: async () => {
      const res = await apiRequest('GET', 
        `/api/animes?page=${page}&limit=${limit}${selectedGenreId ? `&genreId=${selectedGenreId}` : ''}`
      );
      return res.json();
    },
    enabled: !!selectedGenreId, // Only run query if a genre is selected
  });

  const animes = animesResponse?.data || [];
  const totalAnimes = animesResponse?.total || 0;
  const totalPages = Math.ceil(totalAnimes / limit);

  const handleGenreClick = (genreId: number) => {
    setSelectedGenreId(genreId);
    setPage(1); // Reset to first page when changing genre
  };

  const clearGenreSelection = () => {
    setSelectedGenreId(null);
  };

  const isLoading = genresLoading || (animesLoading && !!selectedGenreId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageTitle
          title="Anime Genres"
          subtitle="Browse anime by your favorite genres"
        />

        {genresLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spinner />
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant={selectedGenreId === genre.id ? "default" : "outline"}
                  className={`cursor-pointer text-sm py-1 px-3 ${
                    selectedGenreId === genre.id 
                      ? "bg-[#ff3a3a] hover:bg-[#e62e2e]" 
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                  onClick={() => handleGenreClick(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            {selectedGenreId && (
              <div className="flex items-center mb-6">
                <span className="text-gray-400 mr-4">
                  Showing results for: {genres.find(g => g.id === selectedGenreId)?.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white"
                  onClick={clearGenreSelection}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        )}

        {!selectedGenreId ? (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-4">Select a genre above to browse anime</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {genres.slice(0, 12).map((genre) => (
                <div 
                  key={genre.id}
                  className="bg-gray-800 rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleGenreClick(genre.id)}
                >
                  <span className="text-white font-medium">{genre.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FilterX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Error loading content</h3>
            <p className="text-gray-400 mb-4">There was a problem fetching anime for this genre.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : animes.length === 0 ? (
          <div className="text-center py-12">
            <FilterX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No anime found</h3>
            <p className="text-gray-400">We couldn't find any anime for this genre.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {animes.map((anime) => (
                <AnimeCard 
                  key={anime.id} 
                  id={anime.id} 
                  title={anime.title}
                  imageUrl={anime.coverImage || ''}
                  type={anime.type}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                >
                  Previous
                </Button>

                <div className="flex items-center px-4 text-sm">
                  <span className="text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default GenresPage;