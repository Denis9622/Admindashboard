import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./dashboardPage.module.scss";
import Statistics from "../components/dashboard/Statistics.jsx";
import RecentCustomers from "../components/dashboard/RecentCustomers.jsx";
import IncomeExpenses from "../components/dashboard/IncomeExpenses.jsx";
import {
  fetchStatistics,
  fetchRecentCustomers,
  } from "../redux/dashboard/dashboardOperations";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { statistics, recentCustomers, incomeExpenses, loading, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStatistics());
    dispatch(fetchRecentCustomers());
  }, [dispatch]);

  return (
    <div className={styles.dashboard}>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <Statistics data={statistics} />
      <div className={styles.grid}>
        <RecentCustomers data={recentCustomers} />
        <IncomeExpenses data={incomeExpenses} />
      </div>
    </div>
  );
};

export default DashboardPage;
