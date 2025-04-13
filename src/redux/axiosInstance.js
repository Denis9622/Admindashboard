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

    if (!error.response) {
      return Promise.reject(error);
    }

    // Если получили 403, значит токен недействителен
    if (error.response.status === 403) {
      localStorage.clear();
      setAuthHeader(null);
      return Promise.reject(error);
    }

    // Обрабатываем только 401 ошибку для запросов, не связанных с авторизацией
    if (
      error.response.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Пробуем обновить токен
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;

        if (!accessToken) {
          throw new Error("Не получен новый токен доступа");
        }

        // Обновляем токен и повторяем запрос
        localStorage.setItem("token", accessToken);
        await setAuthHeader(accessToken);
        return api(originalRequest);

      } catch (refreshError) {
        // Если не удалось обновить токен, очищаем данные и перенаправляем на логин
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    // Для остальных ошибок просто возвращаем их
    return Promise.reject(error);
  }
);

// Экспортируем api
export default api;
