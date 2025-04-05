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
});

// Установка заголовка Authorization
export const setAuthHeader = async (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Перехватчик ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await store.dispatch(refreshToken());
        const newToken = localStorage.getItem("token");
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Ошибка обновления токена:", refreshError.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Экспортируем api
export default api;
