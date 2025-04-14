import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import HomePage from "./pages/home";
import AuthPage from "./pages/auth-page";
import AnimeDetail from "./pages/anime-detail";
import WatchPage from "./pages/watch";
import SearchPage from "./pages/search";
import WatchlistPage from "./pages/watchlist";
import FavoritesPage from "./pages/favorites";
import DownloadPage from "./pages/download";
import ProfilePage from "./pages/profile";
import PopularPage from "./pages/popular";
import GenresPage from "./pages/genres";
import AdminDashboard from "./pages/admin/dashboard";
import AdminAnimeList from "./pages/admin/anime-list";
import AdminAnimeEdit from "./pages/admin/anime-edit";
import AdminSeasonManagement from "./pages/admin/season-management";
import AdminEpisodeManagement from "./pages/admin/episode-management";
import AdminUserManagement from "./pages/admin/user-management";
import AdminUserSessions from "./pages/admin/user-sessions";
import SimpleSeasonManagementPage from "./pages/admin/simple-seasons";
import RequestsManagementPage from "./pages/admin/requests";
import AdminSeasonsPage from "./pages/admin/seasons";
import AdminMoviesPage from "./pages/admin/movies";
import AdminMovieEditPage from "./pages/admin/movie-edit";
import FAQPage from "./pages/static/faq";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { DataSyncProvider } from "./hooks/use-data-sync";
// No longer using loading screen

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/watch/:animeId" component={WatchPage} />
      <Route path="/watch/:animeId/:seasonId" component={WatchPage} />
      <Route path="/watch/:animeId/:seasonId/:episodeId" component={WatchPage} />
      <Route path="/download/:episodeId" component={DownloadPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/anime/popular" component={PopularPage} />
      <Route path="/genres" component={GenresPage} />
      
      {/* User Protected Routes */}
      <ProtectedRoute path="/watchlist" component={WatchlistPage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Admin Only Routes - explicitly marked as adminOnly */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/anime" component={AdminAnimeList} adminOnly={true} />
      <ProtectedRoute path="/admin/anime/new" component={AdminAnimeEdit} adminOnly={true} />
      <ProtectedRoute path="/admin/anime/:id/edit" component={AdminAnimeEdit} adminOnly={true} />
      <ProtectedRoute path="/admin/episode-management" component={AdminEpisodeManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/episode-management/:id" component={AdminEpisodeManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/seasons" component={AdminSeasonsPage} adminOnly={true} />
      <ProtectedRoute path="/admin/users" component={AdminUserManagement} adminOnly={true} />
      <ProtectedRoute path="/admin/sessions" component={AdminUserSessions} adminOnly={true} />
      <ProtectedRoute path="/admin/requests" component={RequestsManagementPage} adminOnly={true} />
      
      {/* Movie Management Routes */}
      <ProtectedRoute path="/admin/movies" component={AdminMoviesPage} adminOnly={true} />
      <ProtectedRoute path="/admin/movies/new" component={AdminMovieEditPage} adminOnly={true} />
      <ProtectedRoute path="/admin/movies/:id/edit" component={AdminMovieEditPage} adminOnly={true} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataSyncProvider>
          <Router />
          <Toaster />
        </DataSyncProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
