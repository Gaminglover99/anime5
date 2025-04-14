import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Anime } from "@shared/schema";
import { Edit, Plus, Trash, Film, Eye } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import AdminLayout from "../../components/admin/admin-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";

const MoviesPage = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch all movies (type = 'Movie')
  const { data: moviesData, isLoading } = useQuery<{ data: Anime[] }>({
    queryKey: ["/api/animes", { type: "Movie" }],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/animes?type=Movie");
      return res.json();
    },
  });

  const movies = moviesData?.data || [];

  // Delete anime mutation
  const deleteAnimeMutation = useMutation({
    mutationFn: async (animeId: number) => {
      await apiRequest("DELETE", `/api/animes/${animeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({
        title: "Movie deleted",
        description: "The movie has been successfully deleted.",
      });
      setAnimeToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete movie",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter movies based on search term
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMovie = (movie: Anime) => {
    setAnimeToDelete(movie);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMovie = () => {
    if (animeToDelete) {
      deleteAnimeMutation.mutate(animeToDelete.id);
    }
  };

  return (
    <AdminLayout title="Movie Management">
      <div className="p-6">
        <Card className="bg-[#222] border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-2xl">Movies</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage all movie-type anime titles in your library
                </CardDescription>
              </div>
              <Button 
                className="bg-[#ff3a3a] hover:bg-[#e62e2e] text-white"
                onClick={() => navigate("/admin/movies/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Movie
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a] max-w-md"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 
                  "No movies found matching your search." : 
                  "No movies found in the database. Add your first movie."
                }
              </div>
            ) : (
              <div className="rounded-md border border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow>
                      <TableHead className="text-white">Title</TableHead>
                      <TableHead className="text-white">Release Year</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Rating</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovies.map((movie) => (
                      <TableRow key={movie.id} className="hover:bg-gray-700 border-gray-700">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center">
                            <Film className="mr-2 h-4 w-4 text-[#ff3a3a]" />
                            {movie.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{movie.releaseYear}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                            ${movie.status === 'Completed' ? 'bg-green-600 text-white' : 
                              movie.status === 'Ongoing' ? 'bg-blue-600 text-white' : 
                              'bg-yellow-600 text-white'
                            }`}
                          >
                            {movie.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {movie.rating ? `${movie.rating}/10` : 'Not rated'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500"
                              onClick={() => navigate(`/anime/${movie.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-500"
                              onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDeleteMovie(movie)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-gray-700 flex justify-between">
            <div className="text-sm text-gray-400">
              {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Delete Movie Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#222] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will delete the movie "{animeToDelete?.title}" and all its content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteMovie}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default MoviesPage;