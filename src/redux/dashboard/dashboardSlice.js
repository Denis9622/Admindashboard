import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStatistics,
  fetchRecentCustomers,
  fetchIncomeExpenses,
  fetchCustomersWithSpent,
} from "./dashboardOperations";

const initialState = {
  transactions: [],
  statistics: null,
  recentCustomers: [],
  incomeExpenses: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.recentCustomers = action.payload;
      })
      .addCase(fetchRecentCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIncomeExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload?.transactions || [];
        state.error = null;
      })
      .addCase(fetchIncomeExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка загрузки транзакций";
        state.transactions = [];
      })
      .addCase(fetchCustomersWithSpent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersWithSpent.fulfilled, (state, action) => {
        state.loading = false;
        state.recentCustomers = action.payload;
      })
      .addCase(fetchCustomersWithSpent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
