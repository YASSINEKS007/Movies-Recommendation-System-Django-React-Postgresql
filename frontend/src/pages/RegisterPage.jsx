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
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import MainNavBar from "../components/MainNavBar";

function RegisterPage() {
  const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
  const [showPassword, setShowPassword] = useState(false);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const navigate = useNavigate();
  const theme = useTheme();
  const { palette } = useTheme();
  const linkMessage = "Already have an account? Login here.";

  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    "confirm-email": yup
      .string()
      .oneOf([yup.ref("email"), null], "Emails must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      delete data["confirm-email"];
      const response = await axios.post(`${backendHost}/app/register/`, {
        username: data["username"],
        password: data["password"],
        email: data["email"],
      });
      console.log(response); //use toast later
      navigate("/login");
    } catch (error) {
      console.log(error);
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
            Register
          </Typography>
        </div>
        <div className="flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, 1fr)"
            >
              <TextField
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                label="Username"
                variant="outlined"
                sx={{ gridColumn: isNotMobileScreen ? "span 2" : "span 4" }}
              />
              <FormControl
                sx={{ gridColumn: isNotMobileScreen ? "span 2" : "span 4" }}
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
              <TextField
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                label="Email"
                type="email"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                {...register("confirm-email")}
                error={!!errors["confirm-email"]}
                helperText={errors["confirm-email"]?.message}
                label="Confirm Email"
                type="email"
                variant="outlined"
                sx={{ gridColumn: "span 4" }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ gridColumn: "span 4" }}
              >
                Register
              </Button>
            </Box>
            <Typography
              className="mt-2"
              onClick={() => navigate("/")}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
                gridColumn: "span 4",
              }}
            >
              {linkMessage}
            </Typography>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
