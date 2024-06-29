import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { themeSettings } from "./themes/main";
import RegisterPage from "./pages/RegisterPage";
import NotAuthorized from "./pages/NotAuthorized";
import "./interceptor.js";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthenticated = useSelector((state) => state.accessToken != null);
  console.log("is Authenticated " ,  isAuthenticated)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <HomePage /> : <NotAuthorized />}
          />

          <Route
            path="*"
            element={<LoginPage />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
