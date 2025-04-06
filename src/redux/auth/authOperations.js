import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axiosInstance"; // Используем настроенный api
import { setAuthHeader } from "../axiosInstance";

// 📌 Регистрация пользователя
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { id, name, email, accessToken } = response.data.data;

      // Сохраняем только access token и данные пользователя
      localStorage.setItem("user", JSON.stringify({ id, name, email }));
      localStorage.setItem("token", accessToken);
      setAuthHeader(accessToken);

      return { id, name, email, accessToken };
    } catch (error) {
      console.error(
        "Ошибка регистрации:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Ошибка регистрации");
    }
  }
);

// 📌 Вход пользователя
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, accessToken } = response.data.data;

      // Сохраняем только access token и данные пользователя
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      setAuthHeader(accessToken);

      return { user, accessToken };
    } catch (error) {
      console.error("Ошибка входа:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Ошибка входа");
    }
  }
);

// 📌 Выход пользователя
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");

      // Очищаем локальные данные
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthHeader(null);

      return null;
    } catch (error) {
      console.error("Ошибка выхода:", error.response?.data || error.message);
      // Даже при ошибке очищаем данные
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthHeader(null);
      return rejectWithValue(error.response?.data || "Ошибка выхода");
    }
  }
);

// 📌 Обновление токена
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");
      const { accessToken } = response.data;

      localStorage.setItem("token", accessToken);
      setAuthHeader(accessToken);

      return { accessToken };
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuthHeader(null);
      return rejectWithValue("Не удалось обновить токен. Авторизуйтесь снова.");
    }
  }
);
