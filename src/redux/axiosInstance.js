import axios from "axios";
import { store } from "./store";
import { refreshToken } from "./auth/authOperations";

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

    // Если получили 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;

        // Сохраняем новый токен
        localStorage.setItem("token", accessToken);
        setAuthHeader(accessToken);

        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен - разлогиниваем пользователя
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
