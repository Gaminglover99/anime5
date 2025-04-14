import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { queryClient } from "../../lib/queryClient";
import AdminLayout from "../../components/admin/admin-layout";
import MovieEditForm from "../../components/admin/movie-edit-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

const MovieEditPage = () => {
  const [, params] = useRoute<{ id: string }>("/admin/movies/:id/edit");
  const [isNewRoute] = useRoute("/admin/movies/new");
  const [, navigate] = useLocation();
  
  const movieId = params ? parseInt(params.id) : undefined;
  const isNew = isNewRoute || false;
  
  // Pre-fetch anime data if editing
  useEffect(() => {
    if (movieId) {
      queryClient.prefetchQuery({
        queryKey: [`/api/animes/${movieId}`],
      });
    }
  }, [movieId]);
  
  return (
    <AdminLayout title={isNew ? "Add New Movie" : "Edit Movie"}>
      <div className="p-6">
        <div className="mb-6 flex items-center">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 mr-4"
            onClick={() => navigate("/admin/movies")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {isNew ? "Add New Movie" : "Edit Movie"}
          </h1>
        </div>
        
        <MovieEditForm movieId={movieId} />
      </div>
    </AdminLayout>
  );
};

export default MovieEditPage;