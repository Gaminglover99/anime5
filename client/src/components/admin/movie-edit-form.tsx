import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import type { Genre, Anime } from "@shared/schema";
import { queryClient, apiRequest } from "../../lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Info, Film, Video, Save, Loader2 } from "lucide-react";
import { MultiSelect, OptionType } from "../../components/ui/multi-select";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import SimplifiedMovieEpisodeManagement from "./simplified-movie-episode-management";

interface MovieEditFormProps {
  movieId?: number;
}

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  releaseYear: z.number().int().min(1900, "Release year must be at least 1900"),
  status: z.enum(["Ongoing", "Completed", "Upcoming"]),
  coverImage: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
  bannerImage: z.string().url("Banner image must be a valid URL").optional().or(z.literal("")),
  rating: z.coerce.number().min(0, "Rating must be at least 0").max(10, "Rating must be at most 10").optional(),
  genreIds: z.array(z.number()).min(1, "Select at least one genre"),
  duration: z.string().optional(),
  trailer: z.string().url("Trailer must be a valid URL").optional().or(z.literal("")),
});

type MovieFormValues = z.infer<typeof movieSchema>;

const MovieEditForm = ({ movieId }: MovieEditFormProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [movieCreated, setMovieCreated] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<{ value: string | number; label: string }[]>([]);
  
  // Fetch movie data if editing
  const { data: movieData, isLoading: isLoadingMovie } = useQuery<Anime>({
    queryKey: [`/api/animes/${movieId}`],
    enabled: !!movieId,
  });
  
  // Fetch genres for dropdown
  const { data: genresResponse, isLoading: isLoadingGenres } = useQuery<{data: Genre[]}>({
    queryKey: ["/api/genres"],
  });
  
  const genresOptions: { value: string | number; label: string }[] = genresResponse?.data?.map(genre => ({
    value: genre.id,
    label: genre.name,
  })) || [];
  
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseYear: new Date().getFullYear(),
      status: "Upcoming",
      coverImage: "",
      bannerImage: "",
      rating: 0,
      genreIds: [],
      duration: "",
      trailer: "",
    },
  });
  
  // Set form values when movie data is loaded
  useEffect(() => {
    if (movieData) {
      form.reset({
        title: movieData.title,
        description: movieData.description || "",
        releaseYear: typeof movieData.releaseYear === 'number' ? movieData.releaseYear : new Date().getFullYear(),
        status: movieData.status as "Ongoing" | "Completed" | "Upcoming",
        coverImage: movieData.coverImage || "",
        bannerImage: movieData.bannerImage || "",
        rating: movieData.rating !== null ? Number(movieData.rating) : 0,
        genreIds: movieData.genres?.map(g => g.id) || [],
        duration: movieData.duration || "",
        trailer: (movieData as any).trailer || "",
      });
      
      // Set selected genres for UI
      if (movieData.genres) {
        setSelectedGenres(
          movieData.genres.map(genre => ({
            value: genre.id,
            label: genre.name,
          }))
        );
      }
    }
  }, [movieData, form]);
  
  // Movie mutation (create or update)
  const movieMutation = useMutation({
    mutationFn: async (data: MovieFormValues) => {
      if (movieId) {
        // Update existing movie
        await apiRequest("PUT", `/api/animes/${movieId}`, {
          ...data,
          type: "Movie", // Ensure type is Movie
        });
        return movieId;
      } else {
        // Create new movie
        const response = await apiRequest("POST", "/api/animes", {
          ...data,
          type: "Movie", // Ensure type is Movie
        });
        const createdMovie = await response.json();
        return createdMovie.id;
      }
    },
    onSuccess: (newMovieId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      if (movieId) {
        queryClient.invalidateQueries({ queryKey: [`/api/animes/${movieId}`] });
      }
      
      toast({
        title: movieId ? "Movie updated" : "Movie created",
        description: movieId 
          ? "The movie has been successfully updated." 
          : "The movie has been successfully created.",
      });
      
      if (!movieId) {
        // If we just created a new movie, update the URL and set flags for content tab
        navigate(`/admin/movies/${newMovieId}/edit`);
        setMovieCreated(true);
        setActiveTab("content");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: MovieFormValues) => {
    movieMutation.mutate(data);
  };
  
  const handleGenreChange = (selected: { value: string | number; label: string }[]) => {
    setSelectedGenres(selected);
    form.setValue("genreIds", selected.map(g => typeof g.value === 'string' ? parseInt(g.value) : g.value));
  };
  
  if (isLoadingMovie && movieId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="details" className="data-[state=active]:bg-[#ff3a3a] data-[state=active]:text-white">
            <Info className="w-4 h-4 mr-2" />
            Movie Details
          </TabsTrigger>
          <TabsTrigger 
            value="content" 
            className="data-[state=active]:bg-[#ff3a3a] data-[state=active]:text-white"
            disabled={!movieId && !movieCreated}
          >
            <Video className="w-4 h-4 mr-2" />
            Video Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card className="bg-[#222] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-xl">Movie Information</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the basic information about the movie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Movie Title *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter movie title" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="releaseYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Release Year *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2023" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className="bg-gray-800 border-gray-700 text-white" 
                            />
                          </FormControl>
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
                        <FormLabel className="text-white">Movie Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter movie description" 
                            {...field} 
                            className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Status *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Ongoing">Now Playing</SelectItem>
                              <SelectItem value="Completed">Released</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Rating (1-10)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              min="0"
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              className="bg-gray-800 border-gray-700 text-white" 
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
                          <FormLabel className="text-white">Duration (e.g. "1h 30m")</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="1h 45m" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Cover Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/cover.jpg" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2 h-24 w-16 rounded overflow-hidden">
                              <img 
                                src={field.value} 
                                alt="Cover preview" 
                                className="h-full w-full object-cover"
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
                          <FormLabel className="text-white">Banner Image URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/banner.jpg" 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2 h-24 rounded overflow-hidden">
                              <img 
                                src={field.value} 
                                alt="Banner preview" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/1280x720?text=Error";
                                }}
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="trailer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Trailer URL (YouTube)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://www.youtube.com/watch?v=xyz" 
                            {...field} 
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="genreIds"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-white">Genres *</FormLabel>
                        <FormControl>
                          <MultiSelect
                            selected={selectedGenres}
                            options={genresOptions}
                            onChange={handleGenreChange}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Select genres"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedGenres.map((genre) => (
                            <Badge key={genre.value} className="bg-[#ff3a3a]">
                              {genre.label}
                            </Badge>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#ff3a3a] hover:bg-red-700 text-white min-w-[120px]"
                      disabled={movieMutation.isPending}
                    >
                      {movieMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {movieId ? "Update Movie" : "Create Movie"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          {movieId ? (
            <SimplifiedMovieEpisodeManagement animeId={movieId} />
          ) : (
            <Card className="bg-[#222] border-gray-800">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-400">
                  Please save the movie details first before adding video content
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MovieEditForm;