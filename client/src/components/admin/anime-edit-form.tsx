import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Trash } from "lucide-react";
import { z } from "zod";
import { Anime, InsertAnime, insertAnimeSchema, animeTypeEnum, animeStatusEnum } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface AnimeEditFormProps {
  animeId?: number;
}

const AnimeEditForm = ({ animeId }: AnimeEditFormProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isEditMode = !!animeId;

  // Fetch anime data if in edit mode
  const { data: anime, isLoading: isLoadingAnime } = useQuery<Anime>({
    queryKey: [`/api/animes/${animeId}`],
    enabled: isEditMode,
  });

  // Fetch genres
  const { data: genres } = useQuery<Array<{ id: number; name: string }>>({
    queryKey: ["/api/genres"],
  });

  // We don't need a separate query for anime genres as they are included in the anime response

  // Track if the current form is for a movie to show correct UI elements
  const [isMovieType, setIsMovieType] = useState(false);
  
  const form = useForm<InsertAnime>({
    resolver: zodResolver(insertAnimeSchema.extend({
      rating: z.string().optional(),
    })),
    defaultValues: {
      title: "",
      description: "",
      type: "TV",
      status: "Ongoing",
      releaseYear: new Date().getFullYear(),
      rating: "0",
      duration: "",
      coverImage: "",
      bannerImage: "",
      featured: false,
      genres: [],
    },
  });

  // Store original form data for undo functionality
  const [originalFormData, setOriginalFormData] = useState<InsertAnime | null>(null);

  // Initialize form with anime data when it's loaded
  useEffect(() => {
    if (anime && genres) {
      console.log("Raw anime data:", anime);
      
      // Extract genre IDs from the anime object
      const selectedGenreIds = (anime.genres || []).map((genre) => genre.id);
      
      // Create form data with proper default values for all fields
      const formData = {
        title: anime.title || "",
        description: anime.description || "",
        type: anime.type || "TV",
        status: anime.status || "Ongoing",
        releaseYear: anime.releaseYear || new Date().getFullYear(),
        rating: anime.rating ? anime.rating.toString() : "0",
        duration: anime.duration || "",
        coverImage: anime.coverImage || "",
        bannerImage: anime.bannerImage || "",
        featured: !!anime.featured,
        genres: selectedGenreIds,
      };
      
      // Store the original data for undo functionality
      if (!originalFormData) {
        setOriginalFormData(formData);
      }
      
      // Update the isMovieType state based on the anime type
      setIsMovieType(anime.type === "Movie");
      
      // Force the form to reset with the new data
      setTimeout(() => {
        form.reset(formData);
        console.log("Anime data loaded for editing:", formData);
      }, 50);
    }
  }, [anime, genres, form, originalFormData]);

  // Create or update anime
  const mutation = useMutation({
    mutationFn: async (data: InsertAnime) => {
      if (isEditMode) {
        return await apiRequest("PUT", `/api/animes/${animeId}`, data);
      } else {
        return await apiRequest("POST", "/api/animes", data);
      }
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      
      toast({
        title: isEditMode ? "Anime updated" : "Anime created",
        description: isEditMode
          ? "The anime has been successfully updated."
          : "The anime has been successfully created.",
      });
      
      if (!isEditMode) {
        navigate(`/admin/anime/${data.id}/edit`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: isEditMode ? "Failed to update anime" : "Failed to create anime",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete anime
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/animes/${animeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      
      toast({
        title: "Anime deleted",
        description: "The anime has been successfully deleted.",
      });
      
      navigate("/admin/anime");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete anime",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAnime) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoadingAnime) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#222] rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">
          {isEditMode ? "Edit Anime Information" : "Add New Anime"}
        </h2>
        {isEditMode && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center"
          >
            <Trash className="w-4 h-4 mr-1" />
            Delete Anime
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Anime title" 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setIsMovieType(value === "Movie");
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.values(animeTypeEnum.enumValues).map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Anime description"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2 w-24 h-32 bg-gray-800 rounded overflow-hidden">
                      <img
                        src={field.value}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x240?text=Error";
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/banner.jpg"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2 h-32 bg-gray-800 rounded overflow-hidden">
                      <img
                        src={field.value}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Error";
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.values(animeStatusEnum.enumValues).map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                      value={field.value.toString()}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isMovieType ? "1 hr 45 min" : "24 min per ep"}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    {isMovieType ? "Enter the total runtime of the movie" : "Enter the typical episode duration"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className="data-[state=checked]:bg-[#ff3a3a] data-[state=checked]:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Feature this anime on the homepage</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="block mb-2">Genres</FormLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {genres && genres.length > 0 && genres.map((genre) => (
                <FormField
                  key={genre.id}
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={Array.isArray(field.value) && field.value.includes(genre.id)}
                          onCheckedChange={(checked) => {
                            const currentGenres = Array.isArray(field.value) ? field.value : [];
                            if (checked) {
                              field.onChange([...currentGenres, genre.id]);
                            } else {
                              field.onChange(currentGenres.filter((id) => id !== genre.id));
                            }
                          }}
                          className="data-[state=checked]:bg-[#ff3a3a] data-[state=checked]:border-[#ff3a3a]"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        {genre.name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {isEditMode && (
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white border-none"
                onClick={() => navigate(`/admin/episode-management/${animeId}`)}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                </svg>
                {isMovieType ? "Manage Movie Content" : "Manage Seasons & Episodes"}
              </Button>
            </div>
          )}
          
          {/* Show info alert for movies */}
          {isMovieType && (
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-md p-4 mt-4">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-200">
                    <strong>Movie format detected</strong>
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    This anime is set as a Movie. In the episode management section, you'll need to create a single Movie season and add one episode.
                    The episode title can be the same as the movie title.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white border-none"
              onClick={() => navigate("/admin/anime")}
            >
              Cancel
            </Button>
            {isEditMode && originalFormData && (
              <Button
                type="button"
                variant="outline"
                className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                onClick={() => {
                  if (originalFormData) {
                    form.reset(originalFormData);
                    toast({
                      title: "Changes Reset",
                      description: "Form has been reset to original values."
                    });
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo Changes
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-[#ff3a3a] hover:bg-red-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isEditMode ? "Update Anime" : "Create Anime"}
            </Button>
          </div>
        </form>
      </Form>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this anime?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the anime and all associated seasons, episodes, and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                deleteMutation.mutate();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnimeEditForm;
