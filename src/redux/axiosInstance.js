import axios from "axios";
import { store } from "./store";
import { refreshToken } from "./auth/authOperations";

// Функция для проверки доступности сервера
const checkServerAvailability = async (url) => {
  try {
    await axios.get(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Определяем базовый URL
const getBaseUrl = async () => {
  const localUrl = "http://localhost:3000/api";
  const prodUrl = "https://admindashboard-back-qth7.onrender.com/api";

  // Проверяем доступность локального сервера
  const isLocalAvailable = await checkServerAvailability(localUrl);

  return isLocalAvailable ? localUrl : prodUrl;
};

// Создаем экземпляр axios с динамическим baseURL
const createApi = async () => {
  const baseURL = await getBaseUrl();
  console.log("Using API URL:", baseURL);

  return axios.create({
    baseURL,
    withCredentials: true,
  });
};

// Создаем экземпляр api
const api = await createApi();

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
