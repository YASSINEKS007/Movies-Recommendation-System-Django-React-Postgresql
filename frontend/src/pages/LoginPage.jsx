import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import MainNavBar from "../components/MainNavBar";
import { setLogin } from "../state";

function LoginPage() {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const [showPassword, setShowPassword] = useState(false);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const linkMessage = "Don't have an account? Sign Up here";
  const theme = useTheme();

  const schema = yup
    .object({
      email: yup.string().required("Email is required"),
      password: yup.string().required("Password is required"),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendHost}/app/login/`, {
        email: data["email"],
        password: data["password"],
      });

      const { access_token, refresh_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const userObject = {
        userId: user.userId,
        email: user.email,
        username: user.username,
      };

      dispatch(
        setLogin({
          user: userObject,
          accessToken: access_token,
        })
      );

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="h-screen">
      <MainNavBar />
      <div className="mt-20">
        <div>
          <Typography
            fontWeight="500"
            variant="h2"
            sx={{ mb: "1.5rem", textAlign: "center" }}
            color={theme.palette.primary.main}
          >
            Login
          </Typography>
        </div>
        <div className="flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(1, 1fr)"
              sx={{
                width: isNonMobileScreen ? 500 : undefined,
                maxWidth: isNonMobileScreen ? "100%" : undefined,
              }}
            >
              <TextField
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                label="Email"
                type="email"
                variant="outlined"
              />
              <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
                error={!!errors.password}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%" }}
              >
                Login
              </Button>
              <Typography
                onClick={() => navigate("/register")}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                {linkMessage}
              </Typography>{" "}
            </Box>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
