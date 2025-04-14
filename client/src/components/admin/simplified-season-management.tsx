import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Anime, Season, InsertSeason } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, Edit, ArrowLeft } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import SimplifiedEpisodeManagement from "./simplified-episode-management";

interface SimplifiedSeasonManagementProps {
  animeId: number;
  onBack: () => void;
}

const seasonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  number: z.number().int().min(1, "Season number must be at least 1"),
});

type SeasonFormValues = z.infer<typeof seasonSchema>;

const SimplifiedSeasonManagement = ({ animeId, onBack }: SimplifiedSeasonManagementProps) => {
  const { toast } = useToast();
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Fetch anime details
  const { data: animeResponse } = useQuery<{data: Anime}>({
    queryKey: ["/api/animes", animeId],
  });
  
  const anime = animeResponse?.data;
  
  // Fetch seasons
  const { data: seasonsResponse, isLoading: isLoadingSeasons } = useQuery<{data: Season[]}>({
    queryKey: ["/api/animes", animeId, "seasons"],
    enabled: !!animeId,
  });
  
  const seasons = seasonsResponse?.data || [];
  
  const form = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      title: "",
      number: 1,
    },
  });
  
  // Set form values when editing a season
  const setEditForm = (season: Season) => {
    setEditingSeason(season);
    form.reset({
      title: season.title,
      number: season.number,
    });
  };
  
  // Create or update season
  const seasonMutation = useMutation({
    mutationFn: async (data: SeasonFormValues) => {
      if (editingSeason) {
        // Update existing season
        await apiRequest("PUT", `/api/seasons/${editingSeason.id}`, {
          title: data.title,
          number: data.number,
        });
      } else {
        // Create new season
        await apiRequest("POST", "/api/seasons", {
          animeId,
          title: data.title,
          number: data.number,
        });
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: editingSeason ? "Season updated" : "Season created",
        description: editingSeason 
          ? "The season has been successfully updated." 
          : "The season has been successfully created.",
      });
      
      setEditingSeason(null);
      form.reset({
        title: "",
        number: seasons.length > 0 ? Math.max(...seasons.map(s => s.number)) + 1 : 1,
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
      queryClient.invalidateQueries({ queryKey: ["/api/animes", animeId, "seasons"] });
      
      toast({
        title: "Season deleted",
        description: "The season has been successfully deleted.",
      });
      
      setSeasonToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete season",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: SeasonFormValues) => {
    seasonMutation.mutate(data);
  };
  
  const handleDeleteSeason = (season: Season) => {
    setSeasonToDelete(season);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    deleteSeasonMutation.mutate();
  };
  
  // If a season is selected, show episode management
  if (selectedSeason) {
    return (
      <SimplifiedEpisodeManagement
        animeId={animeId}
        seasonId={selectedSeason.id}
        onBack={() => setSelectedSeason(null)}
      />
    );
  }
  
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
            {`Manage Seasons for ${anime?.title || ""}`}
          </h2>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-white font-medium mb-4">
            {editingSeason ? `Edit Season ${editingSeason.number}` : "Add New Season"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season Title</FormLabel>
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
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season Number</FormLabel>
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
            {editingSeason && (
              <Button
                type="button"
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                onClick={() => {
                  setEditingSeason(null);
                  form.reset({
                    title: "",
                    number: seasons.length > 0 ? Math.max(...seasons.map(s => s.number)) + 1 : 1,
                  });
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-[#ff3a3a] hover:bg-red-700 text-white"
              disabled={seasonMutation.isPending}
            >
              {editingSeason ? "Update Season" : "Add Season"}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-white mb-4">Seasons</h3>
        {isLoadingSeasons ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#ff3a3a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : seasons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...seasons]
              .sort((a, b) => a.number - b.number)
              .map((season) => (
                <Card key={season.id} className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Season {season.number}</CardTitle>
                    <CardDescription className="text-gray-400">{season.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <span className="text-gray-400">Episodes: </span>
                      <span>-</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between pt-0">
                    <Button
                      variant="outline"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                      onClick={() => setSelectedSeason(season)}
                    >
                      Manage Episodes
                    </Button>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white border-none"
                        onClick={() => setEditForm(season)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white border-none"
                        onClick={() => handleDeleteSeason(season)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg border border-gray-700">
            No seasons found. Add your first season using the form above.
          </div>
        )}
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the season and all its episodes. This action cannot be undone.
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

export default SimplifiedSeasonManagement;