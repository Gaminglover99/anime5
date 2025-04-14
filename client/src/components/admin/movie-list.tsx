import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Edit, 
  Trash, 
  Search, 
  Film,
  Plus, 
  Loader2,
  SortAsc, 
  SortDesc,
  Eye 
} from "lucide-react";
import { Anime } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "./admin-layout";

const MovieList = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"title" | "releaseYear">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteMovieId, setDeleteMovieId] = useState<number | null>(null);
  
  const { data: animesResponse, isLoading } = useQuery<{data: Anime[]}>({
    queryKey: ["/api/animes"],
  });
  
  // Filter only movies
  const movies = animesResponse?.data?.filter(anime => anime.type === "Movie") || [];
  
  // Apply search and sort
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortField === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else {
      return sortDirection === "asc" 
        ? a.releaseYear - b.releaseYear 
        : b.releaseYear - a.releaseYear;
    }
  });
  
  const handleToggleSort = (field: "title" | "releaseYear") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const deleteMovieMutation = useMutation({
    mutationFn: async (movieId: number) => {
      await apiRequest("DELETE", `/api/animes/${movieId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({
        title: "Movie deleted",
        description: "The movie has been successfully deleted.",
      });
      setDeleteMovieId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const confirmDelete = (movieId: number) => {
    setDeleteMovieId(movieId);
  };
  
  const handleDelete = () => {
    if (deleteMovieId) {
      deleteMovieMutation.mutate(deleteMovieId);
    }
  };
  
  return (
    <AdminLayout title="Movie Management">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Movies</h2>
          <Button 
            className="bg-[#ff3a3a] hover:bg-red-700"
            onClick={() => navigate("/admin/movies/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white" 
            />
          </div>
        </div>
        
        <div className="bg-[#222] rounded-md border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <Loader2 className="h-8 w-8 text-[#ff3a3a] animate-spin" />
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Film className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p>No movies found</p>
              {searchQuery && (
                <p className="mt-2 text-sm">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[60px]">ID</TableHead>
                    <TableHead className="w-[80px]">Cover</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort("title")}>
                      <div className="flex items-center">
                        Title
                        {sortField === "title" && (
                          sortDirection === "asc" ? 
                            <SortAsc className="ml-1 h-4 w-4" /> : 
                            <SortDesc className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleToggleSort("releaseYear")}>
                      <div className="flex items-center">
                        Year
                        {sortField === "releaseYear" && (
                          sortDirection === "asc" ? 
                            <SortAsc className="ml-1 h-4 w-4" /> : 
                            <SortDesc className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovies.map((movie) => (
                    <TableRow key={movie.id} className="border-t border-gray-800">
                      <TableCell className="text-gray-400">{movie.id}</TableCell>
                      <TableCell>
                        <div className="h-12 w-8 rounded overflow-hidden">
                          {movie.coverImage ? (
                            <img 
                              src={movie.coverImage} 
                              alt={movie.title} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x120?text=Cover";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs">
                              No cover
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {movie.title}
                      </TableCell>
                      <TableCell>{movie.releaseYear}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          movie.status === "Ongoing" 
                            ? "bg-green-900 text-green-300" 
                            : movie.status === "Completed" 
                              ? "bg-blue-900 text-blue-300"
                              : "bg-yellow-900 text-yellow-300"
                        }`}>
                          {movie.status === "Ongoing" ? "Now Playing" : 
                           movie.status === "Completed" ? "Released" : "Upcoming"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {movie.rating ? (
                          <span className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{movie.rating}</span>
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/anime/${movie.id}`}>
                            <a className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
                               title="View Movie">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Link>
                          <Link href={`/admin/movies/${movie.id}/edit`}>
                            <a className="p-2 bg-blue-900 hover:bg-blue-800 rounded-full"
                               title="Edit Movie">
                              <Edit className="h-4 w-4" />
                            </a>
                          </Link>
                          <button
                            className="p-2 bg-red-900 hover:bg-red-800 rounded-full"
                            onClick={() => confirmDelete(movie.id)}
                            title="Delete Movie"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={!!deleteMovieId} onOpenChange={() => setDeleteMovieId(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this movie? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleteMovieMutation.isPending}
            >
              {deleteMovieMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default MovieList;