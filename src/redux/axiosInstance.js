import axios from "axios";


// Определяем базовый URL в зависимости от окружения
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://admindashboard-back-qth7.onrender.com/api";

// Создаем экземпляр axios с динамическим baseURL
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Установка заголовка Authorization
export const setAuthHeader = async (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Перехватчик ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, что это не запрос на логин и получили 401
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;

        localStorage.setItem("token", accessToken);
        setAuthHeader(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Если получили 403 - токен недействителен
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Экспортируем api
export default api;
