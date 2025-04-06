import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice.js";
import productsReducer from "./products/productsSlice.js";
import ordersReducer from "./orders/ordersSlice.js";
import customersReducer from "./customers/customersSlice";
import suppliersReducer from "./suppliers/suppliersSlice";
import dashboardReducer from "./dashboard/dashboardSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // Храним только user и token
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    products: productsReducer,
    orders: ordersReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
