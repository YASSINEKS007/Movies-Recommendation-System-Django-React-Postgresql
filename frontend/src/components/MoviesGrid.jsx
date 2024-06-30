import { Grid, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api";
import MovieCard from "./MovieCard";

function MoviesGrid() {
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const [movies, setMovies] = useState([]);
  const isNonMobileScreen = useMediaQuery("(min-width : 1000px)");

  const fetchMovies = async () => {
    try {
      const response = await api.get(`${backendHost}/app/movies/`);
      const data = response.data;
      console.log("Fetched movies data: ", data);
      setMovies(data.slice(1, 10));
    } catch (error) {
      console.error(
        "Error fetching movies: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchMovies();
  });

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
          title={movie.title}
          genres={movie.genres}
        />
      ))}
    </Grid>
  );
}

export default MoviesGrid;
