import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../state";
import {useDispatch} from 'react-redux';

function LoginPage() {
  const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
  const [showPassword, setShowPassword] = useState(false);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

      const { access, refresh, user } = response.data;
      const userData = JSON.parse(user);

      // Create sanitized user object
      const userObject = {
        userId: userData.userId,
        email: userData.email,
        username: userData.username,
      };

      dispatch(
        setLogin({
          user: userObject,
          token: access,
        })
      );

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="border border-blue rounded-lg">
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(1, 1fr)" // Make a single column grid
          >
            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              type="email"
              variant="outlined"
              sx={{ width: "100%" }} // Set the width to 100%
            />
            <FormControl
              sx={{ width: "100%" }} // Set the width to 100%
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
              sx={{ width: "100%" }} // Set the width to 100%
            >
              Login
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
