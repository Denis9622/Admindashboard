import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncomeExpenses } from "../../redux/dashboard/dashboardOperations";
import styles from "./incomeExpenses.module.css";

const IncomeExpenses = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchIncomeExpenses());
  }, [dispatch]);

  console.log("Transactions received:", transactions); // Проверяем данные

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.containerExpenses}>
      <h3>Income/Expenses</h3>
      <div className={styles.incomeExpenses}>
        <div className={styles.today}>Today</div>

        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} className={styles.transaction}>
              <span
                className={
                  transaction.type === "Income" ? styles.income : styles.expense
                }
              >
                {transaction.type}
              </span>
              <span className={styles.transactionName}>
                {transaction.name || "Unknown"}
              </span>
              <span
                className={styles.transactionAmount}
                style={{
                  color: transaction.type === "Income" ? "green" : "red",
                }}
              >
                {transaction.type === "Income" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.noTransactions}>No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default IncomeExpenses;
