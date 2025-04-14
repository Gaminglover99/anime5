import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import type { Episode, Season } from "@shared/schema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
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
import { Plus, Edit, Trash, Play, File, FileVideo, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface SimplifiedMovieEpisodeManagementProps {
  animeId: number;
}

const videoSourceSchema = z.object({
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  quality: z.string().min(1, "Quality is required"),
  language: z.string().min(1, "Language is required"),
});

const episodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  number: z.coerce.number().int().min(1, "Episode number must be at least 1"),
  thumbnail: z.string().url("Please enter a valid thumbnail URL").optional().or(z.literal("")),
  videoSources: z.array(videoSourceSchema).min(1, "At least one video source is required"),
});

type EpisodeFormValues = z.infer<typeof episodeSchema>;

type VideoSource = {
  url: string;
  quality: string;
  language: string;
};

const SimplifiedMovieEpisodeManagement = ({ animeId }: SimplifiedMovieEpisodeManagementProps) => {
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);

  // Fetch the default season (movies typically have only one season)
  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery<{ data: Season[] }>({
    queryKey: [`/api/animes/${animeId}/seasons`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/animes/${animeId}/seasons`);
      return response.json();
    },
  });

  // Create a default season if none exists
  const createSeasonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/animes/${animeId}/seasons`, {
        name: "Season 1",
        number: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/animes/${animeId}/seasons`] });
      toast({
        title: "Season created",
        description: "Default season for movie created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Once we know the seasons, fetch episodes for the default season
  const seasons = seasonsData?.data || [];
  const defaultSeason = seasons.length > 0 ? seasons[0] : null;
  const seasonId = defaultSeason?.id;

  // Fetch episodes if season exists
  const { data: episodesData, isLoading: isLoadingEpisodes } = useQuery<{ data: Episode[] }>({
    queryKey: [`/api/seasons/${seasonId}/episodes`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/seasons/${seasonId}/episodes`);
      return response.json();
    },
    enabled: !!seasonId,
  });

  const episodes = episodesData?.data || [];

  // Check if we need to create a default season
  useEffect(() => {
    if (!isLoadingSeasons && seasons.length === 0) {
      createSeasonMutation.mutate();
    }
  }, [isLoadingSeasons, seasons.length]);

  // Set up form with react-hook-form
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      title: "",
      description: "",
      number: episodes.length + 1,
      thumbnail: "",
      videoSources: [],
    },
  });

  // Reset form when currentEpisode changes
  useEffect(() => {
    if (currentEpisode) {
      // Fetch video sources for the episode
      const fetchVideoSources = async () => {
        try {
          const response = await apiRequest("GET", `/api/episodes/${currentEpisode.id}/sources`);
          const data = await response.json();
          setVideoSources(data.data || []);
          
          form.reset({
            title: currentEpisode.title,
            description: currentEpisode.description || "",
            number: currentEpisode.number,
            thumbnail: currentEpisode.thumbnail || "",
            videoSources: data.data || [],
          });
        } catch (error) {
          console.error("Error fetching video sources:", error);
          setVideoSources([]);
        }
      };
      
      fetchVideoSources();
    } else {
      setVideoSources([]);
      form.reset({
        title: "",
        description: "",
        number: episodes.length + 1,
        thumbnail: "",
        videoSources: [],
      });
    }
  }, [currentEpisode, form]);

  // Add video source
  const handleAddSource = () => {
    const newSource = {
      url: "",
      quality: "720p",
      language: "English",
    };
    
    setVideoSources([...videoSources, newSource]);
    setIsAddingSource(true);
  };

  // Update video source
  const handleUpdateSource = (index: number, field: keyof VideoSource, value: string) => {
    const updatedSources = [...videoSources];
    updatedSources[index] = {
      ...updatedSources[index],
      [field]: value,
    };
    setVideoSources(updatedSources);
    form.setValue("videoSources", updatedSources);
  };

  // Remove video source
  const handleRemoveSource = (index: number) => {
    const updatedSources = videoSources.filter((_, i) => i !== index);
    setVideoSources(updatedSources);
    form.setValue("videoSources", updatedSources);
  };

  // Create/Update episode mutation
  const episodeMutation = useMutation({
    mutationFn: async (data: EpisodeFormValues) => {
      if (currentEpisode) {
        // Update existing episode
        await apiRequest("PUT", `/api/episodes/${currentEpisode.id}`, {
          ...data,
          seasonId: seasonId,
        });
        
        // Update video sources
        for (const source of data.videoSources) {
          // This is simplified; in a real app you'd probably check if each source exists and update/create accordingly
          await apiRequest("POST", `/api/episodes/${currentEpisode.id}/sources`, source);
        }
        
        return currentEpisode.id;
      } else {
        // Create new episode
        const episodeResponse = await apiRequest("POST", `/api/seasons/${seasonId}/episodes`, {
          ...data,
          seasonId: seasonId,
        });
        const newEpisode = await episodeResponse.json();
        
        // Add video sources
        for (const source of data.videoSources) {
          await apiRequest("POST", `/api/episodes/${newEpisode.id}/sources`, source);
        }
        
        return newEpisode.id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/seasons/${seasonId}/episodes`] });
      
      toast({
        title: currentEpisode ? "Episode updated" : "Episode created",
        description: currentEpisode
          ? "The episode has been successfully updated."
          : "The episode has been successfully created.",
      });
      
      setCurrentEpisode(null);
      setIsEditMode(false);
      setVideoSources([]);
      form.reset({
        title: "",
        description: "",
        number: episodes.length + 1,
        thumbnail: "",
        videoSources: [],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete episode mutation
  const deleteEpisodeMutation = useMutation({
    mutationFn: async (episodeId: number) => {
      await apiRequest("DELETE", `/api/episodes/${episodeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/seasons/${seasonId}/episodes`] });
      toast({
        title: "Episode deleted",
        description: "The episode has been successfully deleted.",
      });
      setEpisodeToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EpisodeFormValues) => {
    // Ensure we have the video sources in the form data
    data.videoSources = videoSources;
    episodeMutation.mutate(data);
  };

  const handleEditEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsEditMode(true);
  };

  const handleDeleteEpisode = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEpisode = () => {
    if (episodeToDelete) {
      deleteEpisodeMutation.mutate(episodeToDelete.id);
    }
  };

  if (isLoadingSeasons) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Episode form */}
      <Card className="bg-[#222] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            {isEditMode ? `Edit Episode ${currentEpisode?.number}` : "Add Movie Episode"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isEditMode
              ? "Update the movie episode details and video sources"
              : "Add a new episode to this movie with video sources"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Episode basic details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Episode Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter episode title"
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
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Episode Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
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
                    <FormLabel className="text-white">Episode Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter episode description"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/thumbnail.jpg"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <div className="mt-2 h-20 w-36 rounded overflow-hidden">
                        <img
                          src={field.value}
                          alt="Thumbnail preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/360x240?text=Error";
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Video Sources Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Video Sources</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSource}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Source
                  </Button>
                </div>

                {videoSources.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 border border-dashed border-gray-700 rounded-md">
                    No video sources added. Click "Add Source" to add one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoSources.map((source, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-700 rounded-md bg-gray-800 relative"
                      >
                        <div className="absolute top-3 right-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSource(index)}
                            className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-gray-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                          <div className="space-y-2">
                            <FormLabel className="text-white text-sm">Video URL</FormLabel>
                            <Input
                              value={source.url}
                              onChange={(e) => handleUpdateSource(index, "url", e.target.value)}
                              placeholder="https://example.com/video.mp4"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <FormLabel className="text-white text-sm">Quality</FormLabel>
                              <Input
                                value={source.quality}
                                onChange={(e) => handleUpdateSource(index, "quality", e.target.value)}
                                placeholder="720p"
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <FormLabel className="text-white text-sm">Language</FormLabel>
                              <Input
                                value={source.language}
                                onChange={(e) => handleUpdateSource(index, "language", e.target.value)}
                                placeholder="English"
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      setCurrentEpisode(null);
                      form.reset({
                        title: "",
                        description: "",
                        number: episodes.length + 1,
                        thumbnail: "",
                        videoSources: [],
                      });
                    }}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-[#ff3a3a] hover:bg-red-700 text-white min-w-[120px]"
                  disabled={episodeMutation.isPending}
                >
                  {episodeMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileVideo className="mr-2 h-4 w-4" />
                  )}
                  {isEditMode ? "Update Episode" : "Add Episode"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Episodes List */}
      <Card className="bg-[#222] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Movie Episodes</CardTitle>
          <CardDescription className="text-gray-400">
            Manage all episodes for this movie
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingEpisodes ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No episodes found. Add your first episode using the form above.
            </div>
          ) : (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="text-white">#</TableHead>
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Sources</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {episodes.map((episode) => (
                    <TableRow key={episode.id} className="hover:bg-gray-700 border-gray-700">
                      <TableCell className="font-medium text-white">
                        {episode.number}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center">
                          {episode.thumbnail && (
                            <div className="w-10 h-6 mr-2 rounded overflow-hidden">
                              <img
                                src={episode.thumbnail}
                                alt={episode.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/160x90?text=Error";
                                }}
                              />
                            </div>
                          )}
                          {episode.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge className="bg-blue-600 text-white">
                            {(episode as any).videoSourceCount || 0} Sources
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            onClick={() => {
                              window.open(`/watch/${animeId}/${seasonId}/${episode.id}`, "_blank");
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-500"
                            onClick={() => handleEditEpisode(episode)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteEpisode(episode)}
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
      </Card>

      {/* Delete Episode Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#222] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will delete episode "{episodeToDelete?.title}" and all its video sources. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteEpisode}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SimplifiedMovieEpisodeManagement;