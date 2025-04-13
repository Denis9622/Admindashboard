import styles from "./ordersTable.module.css";

const OrdersTable = ({ orders, handleEditOrder, handleDeleteOrder }) => {
  return (
    <div className={styles.ordersTable}>
      <h3>All orders</h3>
      <div className={styles.scrollWrapper}>
        <div className={styles.recentOrders}>
          <table>
            <thead>
              <tr>
                <th>User Info</th>
                <th>Address</th>
                <th>Products</th>
                <th>Order Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noOrders}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customer?.name || "Unknown User"}</td>
                    <td>{order.address}</td>
                    <td>{order.products.length}</td>
                    <td>
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      <div className={styles.buttonBox}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditOrder(order)} // Edit order
                        >
                          <svg className={styles.iconEdit}>
                            <use href="/sprite.svg#icon-edit"></use>
                          </svg>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteOrder(order._id)} // Delete order
                        >
                          <svg className={styles.iconDelete}>
                            <use href="/sprite.svg#icon-delete"></use>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
