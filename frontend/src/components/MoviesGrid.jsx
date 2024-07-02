import { Grid, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";
import MovieCard from "./MovieCard";

function MoviesGrid() {
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const [movies, setMovies] = useState([]);
  const isNonMobileScreen = useMediaQuery("(min-width : 1000px)");
  const userId = useSelector((state) => state.user.userId);

  const fetch_recommendations = async () => {
    try {
      const response = await api.get(
        `${backendHost}/app/recommendations/?userId=${encodeURIComponent(
          userId
        )}`
      );
      const data = response.data;
      setMovies(data);
    } catch (error) {
      console.error(
        "Error fetching movies: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetch_recommendations();
  }, []);

  return (
    <Grid
      container
      gap={5}
      alignItems="center"
      justifyContent="center"
      gridTemplateColumns={
        isNonMobileScreen ? "repeat(3, 1fr)" : "repeat(1, 1fr)"
      }
    >
      {movies.map((movie, index) => (
        <MovieCard
          key={index}
          itemId={movie.movie_id}
          title={movie.title}
          genres={movie.genres}
        />
      ))}
    </Grid>
  );
}

export default MoviesGrid;
