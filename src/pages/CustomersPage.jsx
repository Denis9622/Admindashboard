import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../redux/customers/customersOperations";
import CustomersTable from "../components/customers/CustomersTable";
import styles from "./customersPage.module.css";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const {
    items: customers,
    loading,
    error,
  } = useSelector((state) => state.customers);
  const [filterName, setFilterName] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const handleFilter = () => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    dispatch(addCustomer(customerForm));
    resetCustomerForm();
    setIsModalOpen(false);
  };

  const handleUpdateCustomer = () => {
    if (editCustomerId) {
      dispatch(
        updateCustomer({ id: editCustomerId, customerData: customerForm })
      );
      resetCustomerForm();
      setIsModalOpen(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
    });
    setEditCustomerId(customer._id);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id) => {
    dispatch(deleteCustomer(id));
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: "",
      email: "",
      address: "",
      phone: "",
    });
    setEditCustomerId(null);
  };

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.customersPage}>
      {loading && <p>Loading customers...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className={styles.filterInput}
        />
        <button className={styles.filterButton} onClick={handleFilter}>
          Filter
        </button>
        <button
          className={styles.openModalButton}
          onClick={() => setIsModalOpen(true)}
        >
          {editCustomerId ? "Edit Customer" : "Add Customer"}
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <button
              className={styles.modalClose}
              onClick={() => {
                resetCustomerForm();
                setIsModalOpen(false);
              }}
            >
              ✖
            </button>
            <h2>{editCustomerId ? "Edit Customer" : "Add Customer"}</h2>
            <div className={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={customerForm.name}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                value={customerForm.address}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, phone: e.target.value })
                }
              />
              <button
                onClick={
                  editCustomerId ? handleUpdateCustomer : handleAddCustomer
                }
                className={styles.addButton}
              >
                {editCustomerId ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomersTable
        customers={currentCustomers}
        handleEditCustomer={handleEditCustomer}
        handleDeleteCustomer={handleDeleteCustomer}
      />
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(filteredCustomers.length / itemsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={
                currentPage === index + 1
                  ? styles.activePageButton
                  : styles.pageButton
              }
            >
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
