import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomersWithSpent } from "../../redux/dashboard/dashboardOperations";
import styles from "./recentCustomers.module.css";

const RecentCustomers = () => {
  const dispatch = useDispatch();
  const { recentCustomers, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchCustomersWithSpent());
  }, [dispatch]);

  useEffect(() => {}, [recentCustomers]);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.containerCustomers}>
      <h3>Recent Customers</h3>
      <div className={styles.recentCustomers}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            {recentCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  {customer.totalSpent
                    ? customer.totalSpent.toFixed(2)
                    : "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCustomers;
