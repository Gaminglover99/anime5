import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Season, Episode, InsertEpisode, VideoSource, Anime } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, ArrowLeft, Move, ChevronDown, ChevronUp, List, Eye, ExternalLink } from "lucide-react";

// Component to display episodes within a season in the accordion
function SeasonEpisodesList({ 
  seasonId, 
  animeName,
  seasonNumber,
  seasonTitle,
  onEditEpisode, 
  onDeleteEpisode 
}: { 
  seasonId: number;
  animeName: string;
  seasonNumber: number;
  seasonTitle: string;
  onEditEpisode: (episode: Episode) => void;
  onDeleteEpisode: (episode: Episode) => void;
}) {
  const { data: episodesResponse, isLoading } = useQuery<{data: Episode[]}>({
    queryKey: ["/api/seasons", seasonId, "episodes"],
    queryFn: async () => {
      if (!seasonId) return { data: [] };
      const res = await apiRequest("GET", `/api/seasons/${seasonId}/episodes`);
      return res.json();
    },
    enabled: !!seasonId,
  });
  
  // Get video sources for each episode to show watch/download links
  const { data: videoSourcesData } = useQuery<{data: {[key: number]: VideoSource[]}}>({
    queryKey: ["episodeVideoSources", seasonId],
    queryFn: async () => {
      if (!episodesResponse?.data || episodesResponse.data.length === 0) return { data: {} };
      
      // Create a map of episode ID to video sources
      const sourcesMap: {[key: number]: VideoSource[]} = {};
      
      for (const episode of episodesResponse.data) {
        try {
          const res = await apiRequest("GET", `/api/episodes/${episode.id}/video-sources`);
          const sources = await res.json();
          sourcesMap[episode.id] = sources.data;
        } catch (err) {
          console.error(`Error fetching video sources for episode ${episode.id}:`, err);
          sourcesMap[episode.id] = [];
        }
      }
      
      return { data: sourcesMap };
    },
    enabled: !!episodesResponse?.data && episodesResponse.data.length > 0,
  });
  
  // Sort episodes by number in ascending order
  const episodes = (episodesResponse?.data || []).sort((a, b) => (a.number || 0) - (b.number || 0));
  const videoSources = videoSourcesData?.data || {};
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-3 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (episodes.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400">
        No episodes found for this season.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {episodes.map((episode) => (
        <div key={episode.id} className="bg-gray-750 rounded-md p-3 flex justify-between items-center">
          <div className="flex-1">
            <div className="font-medium text-white">
              Episode {episode.number}: {episode.title}
            </div>
            <div className="text-sm text-gray-400">
              From {animeName} {seasonTitle ? `(${seasonTitle})` : `S${seasonNumber}`}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-blue-500"
              onClick={() => onEditEpisode(episode)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500"
              onClick={() => onDeleteEpisode(episode)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
import {
  Form,
  FormControl,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface EnhancedEpisodeManagementProps {
  animeId: number;
  onBack: () => void;
}

const seasonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  number: z.number().int().min(1, "Season number must be at least 1"),
  animeId: z.number().int(),
});

const episodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  number: z.number().int().min(1, "Episode number must be at least 1"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  seasonId: z.number().int(),
  watchUrl: z.string().min(1, "Watch URL is required"),
  downloadUrl: z.string().optional(),
  isDownloadable: z.boolean().default(false),
});

type SeasonFormValues = z.infer<typeof seasonSchema>;
type EpisodeFormValues = z.infer<typeof episodeSchema>;

const EnhancedEpisodeManagement = ({ animeId, onBack }: EnhancedEpisodeManagementProps) => {
  const { toast } = useToast();
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [showDeleteSeasonDialog, setShowDeleteSeasonDialog] = useState(false);
  const [showDeleteEpisodeDialog, setShowDeleteEpisodeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"seasons" | "episodes">("seasons");
  
  // Fetch anime details
  const { data: anime, isLoading: isLoadingAnime } = useQuery<Anime>({
    queryKey: [`/api/animes/${animeId}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/animes/${animeId}`);
      return res.json();
    },
    enabled: !!animeId,
  });
  
  // Fetch all seasons for this anime only
  const { data: seasonsResponse, isLoading: isLoadingSeasons, refetch: refetchSeasons } = useQuery<{data: Season[]}>({
    queryKey: ["/api/seasons", { animeId }],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/seasons?animeId=${animeId}`);
      return res.json();
    },
    enabled: !!animeId,
  });
  
  // Sort seasons by their number in ascending order
  const seasons = (seasonsResponse?.data || []).sort((a, b) => (a.number || 0) - (b.number || 0));
  
  // Fetch episodes for the active season
  const { data: episodesResponse, isLoading: isLoadingEpisodes, refetch: refetchEpisodes } = useQuery<{data: Episode[]}>({
    queryKey: ["/api/seasons", activeSeason?.id, "episodes"],
    queryFn: async () => {
      if (!activeSeason?.id) return { data: [] };
      const res = await apiRequest("GET", `/api/seasons/${activeSeason.id}/episodes`);
      return res.json();
    },
    enabled: !!activeSeason?.id,
  });
  
  // Sort episodes by their number in ascending order
  const episodes = (episodesResponse?.data || []).sort((a, b) => (a.number || 0) - (b.number || 0));
  
  // Fetch video sources for editing episode
  const { data: videoSourcesResponse, refetch: refetchVideoSources } = useQuery<{data: VideoSource[]}>({
    queryKey: ["/api/episodes", editingEpisode?.id, "video-sources"],
    queryFn: async () => {
      if (!editingEpisode?.id) return { data: [] };
      const res = await apiRequest("GET", `/api/episodes/${editingEpisode.id}/video-sources`);
      return res.json();
    },
    enabled: !!editingEpisode?.id,
  });
  
  const videoSources = videoSourcesResponse?.data || [];
  
  // Determine if anime is a movie
  const isMovie = anime?.type === "Movie";
  
  // Auto-create season effect defined after seasonMutation
  
  // Set the first season as active when data is loaded
  useEffect(() => {
    if (seasons.length > 0 && !activeSeason) {
      console.log("Setting initial active season", seasons[0]);
      setActiveSeason(seasons[0]);
    }
    
    // For movies, automatically set to episodes tab
    if (isMovie && activeTab !== "episodes") {
      setActiveTab("episodes");
    }
  }, [seasons, isMovie, activeTab]);
  
  // Debug for active season changes
  useEffect(() => {
    if (activeSeason) {
      console.log("Active season changed:", activeSeason);
      refetchEpisodes();
    }
  }, [activeSeason, refetchEpisodes]);
  
  // Season form
  const seasonForm = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      title: "",
      number: 1,
      animeId: animeId,
    },
  });
  
  // Episode form
  const episodeForm = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      title: "",
      number: 1,
      description: "",
      thumbnail: "",
      seasonId: activeSeason?.id || 0,
      watchUrl: "",
      downloadUrl: "",
      isDownloadable: false,
    },
  });
  
  // Update episode form when active season changes
  useEffect(() => {
    if (activeSeason?.id) {
      if (!editingEpisode) {
        episodeForm.setValue("seasonId", activeSeason.id);
        console.log("Updated episode form with seasonId from active season:", activeSeason.id);
      }
      
      // Force refetch episodes for the active season
      refetchEpisodes();
    }
  }, [activeSeason?.id, episodeForm, editingEpisode, refetchEpisodes]);
  
  // Reset season form when editing
  useEffect(() => {
    if (editingSeason) {
      seasonForm.reset({
        title: editingSeason.title || "",
        number: editingSeason.number || 1,
        animeId: animeId,
      });
    } else {
      // Calculate next season number
      const nextSeasonNumber = seasons.length > 0 
        ? Math.max(...seasons.map(s => s.number || 0)) + 1 
        : 1;
        
      seasonForm.reset({
        title: "",
        number: nextSeasonNumber,
        animeId: animeId,
      });
    }
  }, [editingSeason, seasons, animeId, seasonForm]);
  
  // Reset episode form when editing
  useEffect(() => {
    if (editingEpisode && videoSourcesResponse) {
      console.log("Loading episode data for editing:", editingEpisode);
      console.log("Video sources for episode:", videoSources);
      
      const watchSource = videoSources.find(vs => !vs.isDownloadable) || videoSources[0];
      const downloadSource = videoSources.find(vs => vs.isDownloadable);
      
      episodeForm.reset({
        title: editingEpisode.title || "",
        number: editingEpisode.number || 1,
        description: editingEpisode.description || "",
        thumbnail: editingEpisode.thumbnail || "",
        seasonId: editingEpisode.seasonId,
        watchUrl: watchSource?.url || "",
        downloadUrl: downloadSource?.url || "",
        isDownloadable: !!downloadSource,
      });
      
      toast({
        title: "Editing Episode",
        description: `Now editing Episode ${editingEpisode.number}: ${editingEpisode.title}`,
      });
    } else if (!editingEpisode) {
      // Calculate next episode number
      const nextEpisodeNumber = episodes.length > 0 
        ? Math.max(...episodes.map(e => e.number || 0)) + 1 
        : 1;
        
      episodeForm.reset({
        title: "",
        number: nextEpisodeNumber,
        description: "",
        thumbnail: "",
        seasonId: activeSeason?.id || 0,
        watchUrl: "",
        downloadUrl: "",
        isDownloadable: false,
      });
    }
  // Carefully choose dependencies to avoid infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingEpisode?.id, episodesResponse?.data, videoSourcesResponse?.data, activeSeason?.id]);
  
  // Create or update season
  const seasonMutation = useMutation({
    mutationFn: async (data: SeasonFormValues) => {
      if (editingSeason) {
        // Update season
        return await apiRequest("PUT", `/api/seasons/${editingSeason.id}`, data);
      } else {
        // Create new season
        return await apiRequest("POST", "/api/seasons", data);
      }
    },
    onSuccess: async (res) => {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", { animeId }] });
      
      toast({
        title: editingSeason ? "Season updated" : "Season created",
        description: editingSeason
          ? "The season has been successfully updated."
          : "The season has been successfully created.",
      });
      
      setEditingSeason(null);
      
      // If we created a new season, set it as active
      if (!editingSeason) {
        setActiveSeason(data);
      }
      
      // Reset form
      const nextSeasonNumber = seasons.length > 0 
        ? Math.max(...seasons.map(s => s.number || 0)) + 1 
        : 1;
        
      seasonForm.reset({
        title: "",
        number: nextSeasonNumber,
        animeId: animeId,
      });
    },
    onError: (error: Error) => {
      toast({
        title: editingSeason ? "Failed to update season" : "Failed to create season",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete season
  const deleteSeasonMutation = useMutation({
    mutationFn: async () => {
      if (seasonToDelete) {
        await apiRequest("DELETE", `/api/seasons/${seasonToDelete.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", { animeId }] });
      
      toast({
        title: "Season deleted",
        description: "The season has been successfully deleted.",
      });
      
      setSeasonToDelete(null);
      setShowDeleteSeasonDialog(false);
      
      // If the active season was deleted, reset active season
      if (activeSeason?.id === seasonToDelete?.id) {
        setActiveSeason(null);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete season",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create or update episode
  const episodeMutation = useMutation({
    mutationFn: async (data: EpisodeFormValues) => {
      console.log("Episode mutation executing with data:", data);
      
      // Ensure we have a valid seasonId
      if (!data.seasonId && activeSeason?.id) {
        data.seasonId = activeSeason.id;
        console.log("Using active season ID as seasonId was missing:", activeSeason.id);
      }
      
      if (!data.seasonId) {
        throw new Error("No season selected. Please select a season for this episode.");
      }
      
      if (editingEpisode) {
        console.log("Updating existing episode:", editingEpisode.id);
        // Update episode
        await apiRequest("PUT", `/api/episodes/${editingEpisode.id}`, {
          title: data.title,
          number: data.number,
          description: data.description,
          thumbnail: data.thumbnail,
        });
        
        // Update or create video sources
        if (videoSources.length > 0) {
          const watchSource = videoSources.find(vs => !vs.isDownloadable) || videoSources[0];
          await apiRequest("PUT", `/api/video-sources/${watchSource.id}`, {
            url: data.watchUrl,
            quality: "default",
            isDownloadable: false,
          });
          
          const downloadSource = videoSources.find(vs => vs.isDownloadable);
          if (data.isDownloadable && data.downloadUrl) {
            if (downloadSource) {
              await apiRequest("PUT", `/api/video-sources/${downloadSource.id}`, {
                url: data.downloadUrl,
                quality: "download",
                isDownloadable: true,
              });
            } else {
              await apiRequest("POST", "/api/video-sources", {
                episodeId: editingEpisode.id,
                url: data.downloadUrl,
                quality: "download",
                isDownloadable: true,
              });
            }
          } else if (downloadSource && (!data.isDownloadable || !data.downloadUrl)) {
            await apiRequest("DELETE", `/api/video-sources/${downloadSource.id}`);
          }
        } else {
          // Create new video source
          await apiRequest("POST", "/api/video-sources", {
            episodeId: editingEpisode.id,
            url: data.watchUrl,
            quality: "default",
            isDownloadable: false,
          });
          
          if (data.isDownloadable && data.downloadUrl) {
            await apiRequest("POST", "/api/video-sources", {
              episodeId: editingEpisode.id,
              url: data.downloadUrl,
              quality: "download",
              isDownloadable: true,
            });
          }
        }
      } else {
        console.log("Creating new episode with season ID:", data.seasonId);
        // Create new episode
        try {
          const episodeResponse = await apiRequest("POST", "/api/episodes", {
            seasonId: data.seasonId,
            title: data.title,
            number: data.number,
            description: data.description || "",
            thumbnail: data.thumbnail || "",
          });
          
          const newEpisode = await episodeResponse.json();
          console.log("New episode created:", newEpisode);
          
          // Create video sources
          await apiRequest("POST", "/api/video-sources", {
            episodeId: newEpisode.id,
            url: data.watchUrl,
            quality: "default",
            isDownloadable: false,
          });
          
          if (data.isDownloadable && data.downloadUrl) {
            await apiRequest("POST", "/api/video-sources", {
              episodeId: newEpisode.id,
              url: data.downloadUrl,
              quality: "download",
              isDownloadable: true,
            });
          }
        } catch (error) {
          console.error("Error creating episode:", error);
          throw error;
        }
      }
      
      return true;
    },
    onSuccess: () => {
      console.log("Episode mutation successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", activeSeason?.id, "episodes"] });
      if (editingEpisode) {
        queryClient.invalidateQueries({ queryKey: ["/api/episodes", editingEpisode.id, "video-sources"] });
      }
      
      toast({
        title: editingEpisode ? "Episode updated" : "Episode created",
        description: editingEpisode 
          ? "The episode has been successfully updated." 
          : "The episode has been successfully created.",
      });
      
      setEditingEpisode(null);
      
      // Reset form
      const nextEpisodeNumber = episodes.length > 0 
        ? Math.max(...episodes.map(e => e.number || 0)) + 1 
        : 1;
        
      episodeForm.reset({
        title: "",
        number: nextEpisodeNumber,
        description: "",
        thumbnail: "",
        seasonId: activeSeason?.id || 0,
        watchUrl: "",
        downloadUrl: "",
        isDownloadable: false,
      });
      
      // Force a refresh of episodes
      if (activeSeason?.id) {
        setTimeout(() => {
          refetchEpisodes();
        }, 500);
      }
    },
    onError: (error: Error) => {
      console.error("Episode mutation error:", error);
      toast({
        title: editingEpisode ? "Failed to update episode" : "Failed to create episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Auto-create a season for movies if none exists
  useEffect(() => {
    if (isMovie && seasons.length === 0 && !seasonMutation.isPending) {
      // Create default Movie season
      seasonMutation.mutate({
        title: "Movie",
        number: 1,
        animeId: animeId
      });
    }
  }, [isMovie, seasons, animeId, seasonMutation]);
  
  // Delete episode
  const deleteEpisodeMutation = useMutation({
    mutationFn: async () => {
      if (episodeToDelete) {
        await apiRequest("DELETE", `/api/episodes/${episodeToDelete.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", activeSeason?.id, "episodes"] });
      
      toast({
        title: "Episode deleted",
        description: "The episode has been successfully deleted.",
      });
      
      setEpisodeToDelete(null);
      setShowDeleteEpisodeDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Move episode to a different season
  const moveEpisode = async (episode: Episode, newSeasonId: number) => {
    try {
      await apiRequest("PUT", `/api/episodes/${episode.id}`, {
        ...episode,
        seasonId: newSeasonId
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", activeSeason?.id, "episodes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", newSeasonId, "episodes"] });
      
      toast({
        title: "Episode moved",
        description: "The episode has been moved to the selected season.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to move episode",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const onSubmitSeason = (data: SeasonFormValues) => {
    seasonMutation.mutate(data);
  };
  
  const onSubmitEpisode = (data: EpisodeFormValues) => {
    // Ensure we have a valid seasonId, use the active season if none is set
    if (!data.seasonId && activeSeason?.id) {
      data.seasonId = activeSeason.id;
      console.log("Setting seasonId to active season before mutation:", activeSeason.id);
    }
    
    if (!data.seasonId) {
      toast({
        title: "Season Required",
        description: "Please select a season for this episode.",
        variant: "destructive",
      });
      return;
    }
    
    // Debug the data being submitted
    console.log("Submitting episode data:", data);
    episodeMutation.mutate(data);
  };
  
  const handleDeleteSeason = (season: Season) => {
    setSeasonToDelete(season);
    setShowDeleteSeasonDialog(true);
  };
  
  const handleDeleteEpisode = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setShowDeleteEpisodeDialog(true);
  };
  
  const confirmDeleteSeason = () => {
    deleteSeasonMutation.mutate();
  };
  
  const confirmDeleteEpisode = () => {
    deleteEpisodeMutation.mutate();
  };
  
  return (
    <div className="bg-[#222] rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-white">
            {`Manage Seasons & Episodes for ${anime?.title || animeId}`}
          </h2>
        </div>
      </div>
      
      <Tabs 
        defaultValue={isMovie ? "episodes" : "seasons"} 
        onValueChange={(value) => setActiveTab(value as "seasons" | "episodes")}
      >
        <TabsList className={`grid w-full ${isMovie ? 'grid-cols-1' : 'grid-cols-2'} mb-6`}>
          {!isMovie && <TabsTrigger value="seasons">Seasons</TabsTrigger>}
          <TabsTrigger value="episodes">{isMovie ? "Movie Details" : "Episodes"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seasons" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingSeason ? "Edit Season" : "Add New Season"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...seasonForm}>
                  <form onSubmit={seasonForm.handleSubmit(onSubmitSeason)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={seasonForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Season Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Season Title" 
                                {...field} 
                                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={seasonForm.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Season Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                        onClick={() => setEditingSeason(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#ff3a3a] hover:bg-[#e62e2e] text-white"
                      >
                        {editingSeason ? "Update Season" : "Add Season"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Seasons List</CardTitle>
                <CardDescription className="text-gray-400">
                  All seasons for this anime
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSeasons ? (
                  <div className="flex justify-center p-4">
                    <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : seasons.length === 0 ? (
                  <div className="text-center p-4 text-gray-400">
                    No seasons found. Add your first season above.
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {seasons.map((season) => (
                      <AccordionItem key={season.id} value={`season-${season.id}`} className="border-gray-700">
                        <AccordionTrigger className={`hover:bg-gray-700 p-3 rounded-md ${activeSeason?.id === season.id ? "bg-gray-700" : ""}`}>
                          <div className="flex justify-between items-center w-full pr-4">
                            <div className="flex items-center">
                              <span className="text-white font-medium">Season {season.number}: {season.title}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSeason(season);
                                  setActiveTab("episodes");
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSeason(season);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSeason(season);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-2 py-2">
                            <SeasonEpisodesList 
                              seasonId={season.id} 
                              animeName={anime?.title || ""}
                              seasonNumber={season.number}
                              seasonTitle={season.title} 
                              onEditEpisode={setEditingEpisode} 
                              onDeleteEpisode={handleDeleteEpisode} 
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="episodes" className="space-y-4">
          {!activeSeason ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center p-4 text-gray-400">
                  {isMovie 
                    ? "Creating a season for this movie. Please wait..."
                    : "Please select a season first from the Seasons tab."
                  }
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <span className="mr-2">
                      {isMovie 
                        ? `Movie Details for ${anime?.title || ""}` 
                        : `Episodes for ${activeSeason.title || `Season ${activeSeason.number}`}`
                      }
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {isMovie
                      ? "Add watch and download links for this movie"
                      : "Add or edit episodes for this season"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...episodeForm}>
                    <form onSubmit={episodeForm.handleSubmit(onSubmitEpisode)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={episodeForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                {isMovie ? "Movie Title" : "Episode Title"}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={isMovie ? "Movie Title" : "Episode Title"}
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={episodeForm.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                {isMovie ? "Display Order" : "Episode Number"}
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                                  value={field.value}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={episodeForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              {isMovie ? "Movie Description" : "Episode Description"} (Optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={isMovie ? "Movie Description" : "Episode Description"} 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                                rows={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={episodeForm.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Thumbnail URL (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/thumbnail.jpg" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={episodeForm.control}
                        name="watchUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Watch URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/video.mp4 or YouTube URL" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={episodeForm.control}
                          name="downloadUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Download URL (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/download.mp4" 
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={episodeForm.control}
                          name="isDownloadable"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-9">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-[#ff3a3a] data-[state=checked]:border-[#ff3a3a]"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-white">Allow Download</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={episodeForm.control}
                        name="seasonId"
                        render={({ field }) => {
                          // Use regular useEffect instead of React.useEffect
                          useEffect(() => {
                            if (activeSeason?.id && (!field.value || field.value === 0)) {
                              field.onChange(activeSeason.id);
                              console.log("Updated seasonId in form to active season:", activeSeason.id);
                            }
                          }, [activeSeason?.id, field.value]);
                          
                          return (
                            <FormItem>
                              <FormLabel className="text-white">Season</FormLabel>
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={(value) => {
                                  const seasonId = parseInt(value);
                                  field.onChange(seasonId);
                                  console.log("Season selected in dropdown:", value, "Parsed as:", seasonId);
                                }}
                                disabled={!!editingEpisode}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-[#ff3a3a]">
                                    <SelectValue placeholder="Select a season" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                  {seasons.map((season) => (
                                    <SelectItem 
                                      key={season.id} 
                                      value={season.id.toString()}
                                      className="text-white focus:bg-gray-700 focus:text-white"
                                    >
                                      {`Season ${season.number}${season.title ? `: ${season.title}` : ''}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {editingEpisode && (
                                <div className="text-xs text-gray-400 mt-1">
                                  To change the season, use the Move option in the episode list
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                          onClick={() => setEditingEpisode(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#ff3a3a] hover:bg-[#e62e2e] text-white"
                        >
                          {isMovie 
                            ? (editingEpisode ? "Update Movie" : "Add Movie") 
                            : (editingEpisode ? "Update Episode" : "Add Episode")
                          }
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{isMovie ? "Movie Content" : "Episode List"}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {isMovie 
                      ? "Video content for this movie"
                      : `All episodes for ${activeSeason.title || `Season ${activeSeason.number}`}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEpisodes ? (
                    <div className="flex justify-center p-4">
                      <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : episodes.length === 0 ? (
                    <div className="text-center p-4 text-gray-400">
                      {isMovie 
                        ? "No movie content added yet. Add media links above."
                        : "No episodes found. Add your first episode above."
                      }
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isMovie ? "Order" : "Episode #"}</TableHead>
                          <TableHead>{isMovie ? "Title" : "Episode Title"}</TableHead>
                          <TableHead>Season</TableHead>
                          <TableHead>Links</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {episodes.map((episode) => (
                          <TableRow key={episode.id} className="hover:bg-gray-700">
                            <TableCell>{episode.number}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{episode.title}</div>
                                {episode.description && (
                                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">{episode.description}</div>
                                )}
                                {episode.thumbnail && (
                                  <div className="mt-1 text-xs text-blue-400 hover:underline">
                                    <a href={episode.thumbnail} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Thumbnail
                                    </a>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {/* Display season information */}
                              {(() => {
                                // Find the season this episode belongs to
                                const season = seasons.find(s => s.id === episode.seasonId);
                                return (
                                  <div className="text-sm">
                                    <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                                      S{season?.number || '?'}: {season?.title || 'Unknown'}
                                    </span>
                                  </div>
                                );
                              })()}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {isLoadingEpisodes ? (
                                  <div className="text-xs text-gray-400">Loading...</div>
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-600 text-white`}>
                                        Watch Link
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-purple-600 text-white`}>
                                        Download Link
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {seasons.length > 1 && episode.seasonId && (
                                  <Select
                                    value={String(episode.seasonId)}
                                    onValueChange={(value) => {
                                      const newSeasonId = parseInt(value);
                                      if (newSeasonId !== episode.seasonId) {
                                        moveEpisode(episode, newSeasonId);
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-8 w-24 mr-2 bg-gray-700 border-gray-600 text-white">
                                      <span className="text-xs">Move</span>
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                      {seasons.map((season) => (
                                        <SelectItem 
                                          key={season.id} 
                                          value={season.id.toString()}
                                          className="text-white focus:bg-gray-700 focus:text-white"
                                        >
                                          {`${season.title || `Season ${season.number}`}`}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-500"
                                  onClick={() => setEditingEpisode(episode)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500"
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
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Delete Season Dialog */}
      <AlertDialog open={showDeleteSeasonDialog} onOpenChange={setShowDeleteSeasonDialog}>
        <AlertDialogContent className="bg-[#222] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will delete the season "{seasonToDelete?.title || `Season ${seasonToDelete?.number}`}" and all its episodes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteSeason}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Episode Dialog */}
      <AlertDialog open={showDeleteEpisodeDialog} onOpenChange={setShowDeleteEpisodeDialog}>
        <AlertDialogContent className="bg-[#222] border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will delete the {isMovie ? "movie" : "episode"} "{episodeToDelete?.title || `${isMovie ? "Movie" : "Episode"} ${episodeToDelete?.number}`}". This action cannot be undone.
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

export default EnhancedEpisodeManagement;