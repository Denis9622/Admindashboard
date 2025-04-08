import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatistics } from "../../redux/dashboard/dashboardOperations";
import styles from "./statistics.module.css";

const Statistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.statistics}>
      <div className={styles.card}>
        <h3>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-coins"></use>
          </svg>
          All products
        </h3>
        <p>{statistics?.totalProducts || 0}</p>
      </div>
      <div className={styles.card}>
        <h3>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-ci_users"></use>
          </svg>
          All Suppliers
        </h3>
        <p>{statistics?.totalSuppliers || 0}</p>
      </div>
      <div className={styles.card}>
        <h3>
          <svg className={styles.icon}>
            <use href="/sprite.svg#icon-ci_users"></use>
          </svg>
          All Customers
        </h3>
        <p>{statistics?.totalCustomers || 0}</p>
      </div>
    </div>
  );
};

export default Statistics;
