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

      localStorage.setItem("user", JSON.stringify({ id, name, email }));
      localStorage.setItem("token", accessToken);
      setAuthHeader(accessToken);

      return { id, name, email, accessToken };
    } catch (error) {
      // При ошибке регистрации очищаем все данные
      localStorage.clear();
      setAuthHeader(null);
      return rejectWithValue(error.response?.data || "Ошибка регистрации");
    }
  }
);

// 📌 Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, accessToken } = response.data.data;

      // Store only access token and user data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      setAuthHeader(accessToken);

      return { user, accessToken };
    } catch (error) {
      // Clear any existing tokens on login error
      localStorage.clear();
      setAuthHeader(null);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// 📌 Logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      
      localStorage.clear();
      setAuthHeader(null);
      
      // Перенаправляем на страницу логина
      window.location.href = '/login';
      return true;
    } catch (error) {
      localStorage.clear();
      setAuthHeader(null);
      // Даже при ошибке перенаправляем на логин
      window.location.href = '/login';
      return rejectWithValue("Ошибка при выходе");
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
