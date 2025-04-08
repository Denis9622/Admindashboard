import styles from "./customersTable.module.css";

const CustomersTable = ({
  customers,
  handleEditCustomer,
  handleDeleteCustomer,
}) => {
  return (
    <div className={styles.customersTable}>
      <h3>All Customers</h3>
      <div className={styles.recentCustomers}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.noCustomers}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <div className={styles.buttonBox}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditCustomer(customer)} // Edit customer
                      >
                        <svg className={styles.iconEdit}>
                          <use href="/sprite.svg#icon-edit"></use>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteCustomer(customer._id)} // Delete customer
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
  );
};

export default CustomersTable;
