import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder } from "../redux/orders/ordersOperations";
import { fetchCustomers } from "../redux/customers/customersOperations";
import OrdersTable from "../components/orders/OrdersTable";
import OrderModal from "../components/orders/OrderModal";
import styles from "./ordersPage.module.scss";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { items: orders } = useSelector((state) => state.orders);
  const {
    items: customers,
    loading: customersLoading,
    error: customersError,
  } = useSelector((state) => state.customers);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleFilterClick = () => {
    if (!searchQuery.trim()) {
      setIsFiltered(false);
      setFilteredOrders([]);
      return;
    }
    const filtered = orders.filter((order) => {
      const customer = customers.find((c) => c._id === order.customerId);
      return (
        customer &&
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredOrders(filtered);
    setIsFiltered(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (id) => {
    dispatch(deleteOrder(id));
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = isFiltered
    ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    : orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.ordersPage}>
      {customersLoading && <p>Loading customers...</p>}
      {customersError && <p className={styles.error}>{customersError}</p>}

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="User Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.filterInput}
        />
        <button className={styles.filterButton} onClick={handleFilterClick}>
          <svg className={styles.filterIcon}>
            <use href="/sprite.svg#icon-filter"></use>
          </svg>
          Filter
        </button>
        <button
          className={styles.openModalButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add Order
        </button>
      </div>

      {isModalOpen && (
        <OrderModal order={selectedOrder} onClose={handleCloseModal} />
      )}

      <OrdersTable
        orders={currentOrders}
        handleEditOrder={handleEditOrder}
        handleDeleteOrder={handleDeleteOrder}
      />
      <div className={styles.pagination}>
        {Array.from(
          {
            length: Math.ceil(
              (isFiltered ? filteredOrders.length : orders.length) /
                itemsPerPage
            ),
          },
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

export default OrdersPage;
