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
import { useState } from "react";

function MovieCard() {
  const [value, setValue] = useState(4.5);

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="Average Rating 4"
        titleTypographyProps={{ variant: "h6", color: "text.primary" }}
        subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
      />
      <CardMedia
        component="img"
        height="200"
        image="https://images.bauerhosting.com/empire/2024/03/the-batman.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=1440&q=80"
        alt="Paella dish"
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
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

export default MovieCard;
