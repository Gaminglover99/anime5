import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Anime, Season, InsertSeason, insertSeasonSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeasonManagementProps {
  animeId: number;
  onSwitchToEpisodes: (seasonId: number) => void;
}

const SeasonManagement = ({ animeId, onSwitchToEpisodes }: SeasonManagementProps) => {
  const { toast } = useToast();
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<InsertSeason | null>(null);

  // Fetch anime details
  const { data: animeResponse } = useQuery<{data: Anime}>({
    queryKey: ["/api/animes", animeId],
  });
  
  const anime = animeResponse?.data;

  // Fetch seasons
  const { data: seasonsResponse, isLoading } = useQuery<{data: Season[]}>({
    queryKey: ["/api/animes", animeId, "seasons"],
  });
  
  const seasons = seasonsResponse?.data;

  const form = useForm<InsertSeason>({
    resolver: zodResolver(insertSeasonSchema),
    defaultValues: {
      animeId: animeId,
      number: 1,
      title: "",
    },
  });
  
  // Set form data when a season is selected for editing
  useEffect(() => {
    if (selectedSeason && isEditing) {
      const formData = {
        animeId: selectedSeason.animeId,
        number: selectedSeason.number,
        title: selectedSeason.title || "",
      };
      
      // Store original data for undo
      if (!originalFormData) {
        setOriginalFormData(formData);
      }
      
      form.reset(formData);
    }
  }, [selectedSeason, isEditing, form, originalFormData]);

  // Create season
  const createMutation = useMutation({
    mutationFn: async (data: InsertSeason) => {
      return await apiRequest("POST", "/api/seasons", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season created",
        description: "The season has been successfully created.",
      });
      
      form.reset({
        animeId: animeId,
        number: (seasons?.length || 0) + 1,
        title: "",
      });
      
      // Reset editing state
      setIsEditing(false);
      setSelectedSeason(null);
      setOriginalFormData(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create season",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update season
  const updateMutation = useMutation({
    mutationFn: async (data: InsertSeason & { id: number }) => {
      return await apiRequest("PUT", `/api/seasons/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season updated",
        description: "The season has been successfully updated.",
      });
      
      // Reset form and editing state
      form.reset({
        animeId: animeId,
        number: (seasons?.length || 0) + 1,
        title: "",
      });
      
      setIsEditing(false);
      setSelectedSeason(null);
      setOriginalFormData(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update season",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete season
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/seasons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season deleted",
        description: "The season has been successfully deleted.",
      });
      
      setSeasonToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete season",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSeason) => {
    if (isEditing && selectedSeason) {
      updateMutation.mutate({
        ...data,
        id: selectedSeason.id
      });
    } else {
      createMutation.mutate(data);
    }
  };
  
  const handleEdit = (season: Season) => {
    setSelectedSeason(season);
    setIsEditing(true);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedSeason(null);
    setOriginalFormData(null);
    
    form.reset({
      animeId: animeId,
      number: (seasons?.length || 0) + 1,
      title: "",
    });
  };

  const handleDelete = (season: Season) => {
    setSeasonToDelete(season);
  };

  const confirmDelete = () => {
    if (seasonToDelete) {
      deleteMutation.mutate(seasonToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#222] rounded-lg p-6 shadow-lg">
      <Tabs defaultValue="seasons">
        <TabsList className="mb-6">
          <TabsTrigger value="seasons" className="data-[state=active]:bg-blue-600">
            Seasons
          </TabsTrigger>
          <TabsTrigger value="episodes" className="data-[state=active]:bg-blue-600" disabled>
            Episodes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="seasons">
          <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              {isEditing ? `Edit Season ${selectedSeason?.number}` : `Add Season for: ${anime?.title}`}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {isEditing 
                ? "Edit this season's details. Click 'Update Season' when finished." 
                : "Add seasons to organize episodes. Each season can contain multiple episodes."}
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter season title"
                            {...field}
                            className="bg-gray-800 border-gray-700 text-white focus:border-[#ff3a3a]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                      {originalFormData && (
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                          onClick={() => form.reset(originalFormData)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Undo Changes
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : null}
                        Update Season
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : null}
                        Create Season
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Form>
          </div>
          
          <div className="mt-6 space-y-3">
            {seasons && seasons.length > 0 ? (
              seasons.map((season) => (
                <div
                  key={season.id}
                  className="bg-blue-600 text-white rounded-md px-6 py-3 shadow-sm flex justify-between items-center group"
                >
                  <span>
                    Season {season.number}: {season.title}
                  </span>
                  <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-blue-700"
                      onClick={() => window.location.href = `/admin/anime/${animeId}/episodes/${season.id}`}
                    >
                      Manage Episodes
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-green-600"
                      onClick={() => handleEdit(season)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-red-600"
                      onClick={() => handleDelete(season)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No seasons found. Create your first season above.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!seasonToDelete} onOpenChange={() => setSeasonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this season?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Season {seasonToDelete?.number}: {seasonToDelete?.title} and all its episodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SeasonManagement;
