import MoviesGrid from "../components/MoviesGrid";
import NavBar from "../components/NavBar";

function HomePage() {
  return (
    <div>
      <NavBar />
      <div className="flex">
        <MoviesGrid/>
      </div>
    </div>
  );
}

export default HomePage;
