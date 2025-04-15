import axios from "axios";


const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://admindashboard-back-qth7.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthHeader = async (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 403) {
      localStorage.clear();
      setAuthHeader(null);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;

        if (!accessToken) {
          throw new Error("Не получен новый токен доступа");
        }

        localStorage.setItem("token", accessToken);
        await setAuthHeader(accessToken);
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
