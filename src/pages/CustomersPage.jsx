import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomer,
} from "../redux/customers/customersOperations";
import CustomersTable from "../components/customers/CustomersTable";
import CustomerModal from "../components/customers/CustomerModal";
import styles from "./customersPage.module.scss";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const {
    items: customers,
    loading,
    error,
  } = useSelector((state) => state.customers);
  const [filterName, setFilterName] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id) => {
    dispatch(deleteCustomer(id));
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
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
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Customer Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className={styles.filterInput}
          />
          <button className={styles.filterButton} onClick={handleFilter}>
            <svg className={styles.filterIcon}>
              <use href="/sprite.svg#icon-filter"></use>
            </svg>
            Filter
          </button>
        </div>
        <button
          className={styles.openModalButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add a new customer
        </button>
      </div>

      {isModalOpen && (
        <CustomerModal customer={selectedCustomer} onClose={handleCloseModal} />
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
            ></button>
          )
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
