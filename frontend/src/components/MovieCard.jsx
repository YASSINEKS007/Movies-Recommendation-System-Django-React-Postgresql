import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import empty from "../assets/empty.jpg";
import api from "../api";

function MovieCard({ itemId, title, genres }) {
  const apiURL = import.meta.env.VITE_API_URL;
  const [poster, setPoster] = useState(null);
  const [value, setValue] = useState(Math.floor(Math.random() * 6));
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const [averageRating, setAverageRating] = useState(null);

  const fetchPoster = async () => {
    try {
      const response = await fetch(`${apiURL}&s=${title.slice(0, -7)}`);
      const data = await response.json();

      if (data.Search && data.Search.length > 0) {
        setPoster(data.Search[0].Poster);
      } else {
        console.log("No poster found for", title);
        setPoster(empty);
      }
    } catch (error) {
      console.error("Error fetching poster:", error);
    }
  };

  const getAverageRating = async () => {
    try {
      const response = await api.get(
        `${backendHost}/app/averageRating/?itemId=${encodeURIComponent(itemId)}`
      );
      const data = response.data;
      setAverageRating(data);
    } catch (err) {
      console.log("error fetching average rating : ", err);
    }
  };

  useEffect(() => {
    fetchPoster();
    getAverageRating();
  }, [apiURL, title]);

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
        titleTypographyProps={{ variant: "h6", color: "text.primary" }}
        subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
      />
      <CardMedia
        component="img"
        height="150"
        image={poster}
        alt={title}
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography
          variant="body1"
          color="text.primary"
        >
          {genres}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
        >
          Average rating : {Math.round(averageRating * 2) / 2}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{ padding: 1 }}
      >
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <span style={{ flexGrow: 1 }} />
        <Rating
          name="half-rating"
          precision={0.5}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          size="small"
        />
      </CardActions>
    </Card>
  );
}

MovieCard.propTypes = {
  itemId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  genres: PropTypes.string,
};

export default MovieCard;
