import { useEffect } from "react";
import { useLocation } from "wouter";
import MovieEditPage from "../movie-edit";

const NewMoviePage = () => {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    navigate("/admin/movies/new/edit");
  }, [navigate]);
  
  return null;
};

export default NewMoviePage;