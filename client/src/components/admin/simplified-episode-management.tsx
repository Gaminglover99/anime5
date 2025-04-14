import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Season, Episode, InsertEpisode, VideoSource } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, Save, ArrowLeft } from "lucide-react";
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

interface SimplifiedEpisodeManagementProps {
  animeId: number;
  seasonId: number;
  onBack: () => void;
}

const episodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  number: z.number().int().min(1, "Episode number must be at least 1"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  videoUrl: z.string().min(1, "Video URL is required"),
  downloadUrl: z.string().optional(),
  isDownloadable: z.boolean().default(false),
});

type EpisodeFormValues = z.infer<typeof episodeSchema>;

const SimplifiedEpisodeManagement = ({ animeId, seasonId, onBack }: SimplifiedEpisodeManagementProps) => {
  const { toast } = useToast();
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch season details
  const { data: seasonResponse } = useQuery<{data: Season}>({
    queryKey: ["/api/seasons", seasonId],
  });
  
  const season = seasonResponse?.data;
  
  // Fetch episodes
  const { data: episodesResponse, isLoading: isLoadingEpisodes, refetch: refetchEpisodes } = useQuery<{data: Episode[]}>({
    queryKey: ["/api/seasons", seasonId, "episodes"],
    enabled: !!seasonId,
  });
  
  const episodes = episodesResponse?.data || [];
  
  // Fetch video sources for editing episode
  const { data: videoSourcesResponse, refetch: refetchVideoSources } = useQuery<{data: VideoSource[]}>({
    queryKey: ["/api/episodes", editingEpisode?.id, "video-sources"],
    enabled: !!editingEpisode,
  });
  
  const videoSources = videoSourcesResponse?.data || [];
  
  const form = useForm<EpisodeFormValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      title: "",
      number: 1,
      description: "",
      thumbnail: "",
      videoUrl: "",
      downloadUrl: "",
      isDownloadable: false,
    },
  });
  
  // Reset form when selecting an episode to edit
  useEffect(() => {
    if (editingEpisode) {
      console.log("Loading episode data for simplified editing:", editingEpisode);
      console.log("Video sources for episode:", videoSources);
      
      const mainVideoSource = videoSources.find(vs => vs.quality === "default") || videoSources[0];
      const downloadSource = videoSources.find(vs => vs.isDownloadable);
      
      form.reset({
        title: editingEpisode.title || "",
        number: editingEpisode.number || 1,
        description: editingEpisode.description || "",
        thumbnail: editingEpisode.thumbnail || "",
        videoUrl: mainVideoSource?.url || "",
        downloadUrl: downloadSource?.url || "",
        isDownloadable: !!downloadSource,
      });
      
      toast({
        title: "Editing Episode",
        description: `Now editing Episode ${editingEpisode.number}: ${editingEpisode.title}`,
        variant: "default",
      });
    } else {
      // Calculate next episode number based on existing episodes
      const nextEpisodeNumber = episodes.length > 0 
        ? Math.max(...episodes.map(e => e.number || 0)) + 1
        : 1;
        
      form.reset({
        title: "",
        number: nextEpisodeNumber,
        description: "",
        thumbnail: "",
        videoUrl: "",
        downloadUrl: "",
        isDownloadable: false,
      });
    }
  }, [editingEpisode, episodes, videoSources, form, toast]);
  
  // Create or update episode
  const episodeMutation = useMutation({
    mutationFn: async (data: EpisodeFormValues) => {
      if (editingEpisode) {
        // Update episode
        await apiRequest("PUT", `/api/episodes/${editingEpisode.id}`, {
          title: data.title,
          number: data.number,
          description: data.description,
          thumbnail: data.thumbnail,
        });
        
        // Update or create video sources
        if (videoSources.length > 0) {
          const mainSource = videoSources.find(vs => vs.quality === "default") || videoSources[0];
          await apiRequest("PUT", `/api/video-sources/${mainSource.id}`, {
            url: data.videoUrl,
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
            url: data.videoUrl,
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
        // Create new episode
        const episodeResponse = await apiRequest("POST", "/api/episodes", {
          seasonId,
          title: data.title,
          number: data.number,
          description: data.description,
          thumbnail: data.thumbnail,
        });
        
        const newEpisode = await episodeResponse.json();
        
        // Create video sources
        await apiRequest("POST", "/api/video-sources", {
          episodeId: newEpisode.id,
          url: data.videoUrl,
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
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", seasonId, "episodes"] });
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
      form.reset({
        title: "",
        number: episodes.length > 0 ? Math.max(...episodes.map(e => e.number)) + 1 : 1,
        description: "",
        thumbnail: "",
        videoUrl: "",
        downloadUrl: "",
        isDownloadable: false,
      });
    },
    onError: (error: Error) => {
      toast({
        title: editingEpisode ? "Failed to update episode" : "Failed to create episode",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete episode
  const deleteEpisodeMutation = useMutation({
    mutationFn: async () => {
      if (episodeToDelete) {
        await apiRequest("DELETE", `/api/episodes/${episodeToDelete.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seasons", seasonId, "episodes"] });
      
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
    episodeMutation.mutate(data);
  };
  
  const handleDeleteEpisode = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
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
            {`Manage Episodes for ${season?.title || seasonId}`}
          </h2>
        </div>
      </div>
      
      <div className="mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Episode Title" 
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
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
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
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Episode Description" 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                      rows={2}
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
                  <FormLabel>Thumbnail URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/thumbnail.jpg" 
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
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/video.mp4" 
                      {...field} 
                      className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="downloadUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Download URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/download.mp4" 
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
                      <FormLabel>Allow Download</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
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
                className="bg-[#ff3a3a] hover:bg-red-700 text-white"
                disabled={episodeMutation.isPending}
              >
                {editingEpisode ? "Update Episode" : "Add Episode"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Episodes</h3>
        {episodes.length > 0 ? (
          <Table className="border-gray-700">
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white">Episode</TableHead>
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Video</TableHead>
                <TableHead className="text-white">Download</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...episodes]
                .sort((a, b) => a.number - b.number)
                .map((episode) => (
                  <TableRow key={episode.id} className="hover:bg-gray-800 border-t border-gray-700">
                    <TableCell className="font-medium text-white">{episode.number}</TableCell>
                    <TableCell className="text-white">{episode.title}</TableCell>
                    <TableCell className="text-white">
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(`/watch?episodeId=${episode.id}`, '_blank');
                        }}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </a>
                    </TableCell>
                    <TableCell className="text-white">
                      {videoSources.some(vs => vs.episodeId === episode.id && vs.isDownloadable) ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white border-none"
                          onClick={() => {
                            setEditingEpisode(episode);
                            refetchVideoSources();
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white border-none"
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
        ) : (
          <div className="text-center py-8 text-gray-400">
            No episodes found. Add your first episode using the form above.
          </div>
        )}
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the episode and all associated video sources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
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

export default SimplifiedEpisodeManagement;