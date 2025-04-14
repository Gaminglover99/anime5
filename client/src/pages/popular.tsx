import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import Layout from '../components/layout/layout';
import { Anime } from '@shared/schema';
import AnimeCard from '../components/AnimeCard';
import { Spinner } from '../components/ui/spinner';
import { Button } from '../components/ui/button';
import { FilterX } from 'lucide-react';
import PageTitle from '../components/ui/page-title';

const PopularPage = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 24; // Items per page

  // Query for popular anime
  const { data: animesResponse, isLoading, error } = useQuery<{data: Anime[], total: number}>({
    queryKey: ['/api/animes', { page, limit, order: 'popularity' }],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/animes?page=${page}&limit=${limit}&order=popularity`);
      return res.json();
    }
  });

  const animes = animesResponse?.data || [];
  const totalAnimes = animesResponse?.total || 0;
  const totalPages = Math.ceil(totalAnimes / limit);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <PageTitle
          title="Popular Anime"
          subtitle="Explore the most popular anime series on our platform"
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FilterX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Error loading content</h3>
            <p className="text-gray-400 mb-4">There was a problem fetching popular anime.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : animes.length === 0 ? (
          <div className="text-center py-12">
            <FilterX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No anime found</h3>
            <p className="text-gray-400">We couldn't find any popular anime at the moment.</p>
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

export default PopularPage;