import MovieCard from "../components/MovieCard";
import NavBar from "../components/NavBar";

function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="flex">
        <MovieCard />
        <MovieCard />
        <MovieCard />
      </div>
    </div>
  );
}

export default HomePage;
