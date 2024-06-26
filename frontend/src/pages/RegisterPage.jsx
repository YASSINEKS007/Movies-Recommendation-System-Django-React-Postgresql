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

function RegisterPage() {
  const isNotMobileScreen = useMediaQuery("(min-width: 1000px)");
  const [showPassword, setShowPassword] = useState(false);
  const backendHost = import.meta.env.VITE_BACKEND_HOST;
  const navigate = useNavigate();

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

  const onSubmit = (data) => {
    delete data["confirm-email"];
    axios
      .post(`${backendHost}/app/register/`, {
        username: data["username"],
        password: data["password"],
        email: data["email"],
      })
      .then(function (response) {
        console.log(response);
        navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
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
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
