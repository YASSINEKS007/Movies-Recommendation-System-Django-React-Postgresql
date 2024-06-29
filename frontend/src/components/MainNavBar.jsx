import { useTheme } from '@mui/material/styles';
import { Typography } from "@mui/material";

function MainNavBar() {
  const theme = useTheme();
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  return (
    <nav
      className="flex items-center justify-between p-4"
      style={{ backgroundColor: `${alt}`, textAlign: "center" }}
    >
      <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 2rem, 2.25rem)"
        color="primary"
        sx={{
          "&:hover": {
            color: primaryLight,
            cursor: "pointer",
          },
          margin: "0 auto",
        }}
      >
        {import.meta.env.VITE_APP_NAME}
      </Typography>
    </nav>
  );
}

export default MainNavBar;
