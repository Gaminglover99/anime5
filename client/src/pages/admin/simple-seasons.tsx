import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Anime } from "@shared/schema";
import SimplifiedSeasonManagement from "@/components/admin/simplified-season-management";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SimpleSeasonManagementPage = () => {
  const params = useParams<{ id: string }>();
  const animeId = parseInt(params.id);
  const [, navigate] = useLocation();

  const { data: animeResponse, isLoading: isLoadingAnime } = useQuery<{data: Anime}>({
    queryKey: [`/api/animes/${animeId}`],
    enabled: !isNaN(animeId),
  });

  const anime = animeResponse?.data;

  if (isLoadingAnime) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Anime Not Found</h2>
            <p className="text-gray-400 mb-6">The anime you're looking for doesn't exist or you don't have permission to manage it.</p>
            <Button 
              onClick={() => navigate("/admin/anime")}
              className="bg-primary hover:bg-primary/90"
            >
              Back to Anime List
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/anime">Anime</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/anime/${animeId}/edit`}>{anime.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Simplified Seasons</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{anime.title}: Simplified Season Management</h1>
          <p className="text-muted-foreground mt-2">
            Use this simplified interface to manage seasons and episodes for this anime. 
            This view focuses on the most common tasks like adding/updating seasons and episodes with their basic information.
          </p>
        </div>

        <SimplifiedSeasonManagement animeId={animeId} onBack={() => navigate(`/admin/anime/${animeId}/edit`)} />
      </main>
      <Footer />
    </div>
  );
};

export default SimpleSeasonManagementPage;