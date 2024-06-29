import axios from "axios";

let refresh = false;
const backendHost = import.meta.env.VITE_BACKEND_HOST;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;

      const refresh_token = localStorage.getItem("refresh_token");

      try {
        const response = await axios.post(
          `${backendHost}/token/refresh/`,
          { refresh: refresh_token },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.access}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);

          // Retry the original request with updated token
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect to login page or handle as needed
      } finally {
        refresh = false;
      }
    }

    // If refresh fails or the original request was not a 401, return the error
    return Promise.reject(error);
  }
);
