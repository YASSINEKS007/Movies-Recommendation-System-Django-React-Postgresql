import api from "./api";

let refresh_state = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !refresh_state) {
      refresh_state = true;

      const refresh = localStorage.getItem("refresh");
      try {
        const response = await api.post(
          "api/token/refresh/",
          { refresh: refresh },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.access}`;

          localStorage.setItem("access", response.data.access);

          // Retry the original request with updated token
          return api(error.config);
        }
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      } finally {
        refresh_state = false;
      }
    }

    return Promise.reject(error);
  }
);
