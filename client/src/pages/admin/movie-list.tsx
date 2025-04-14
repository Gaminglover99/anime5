import AdminLayout from "@/components/admin/admin-layout";
import MovieList from "@/components/admin/movie-list";

const AdminMovieListPage = () => {
  return (
    <AdminLayout title="Movie Management">
      <MovieList />
    </AdminLayout>
  );
};

export default AdminMovieListPage;