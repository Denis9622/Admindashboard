import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  deleteSupplier,
} from "../redux/suppliers/suppliersSlice";
import SuppliersTable from "../components/suppliers/SuppliersTable";
import SupplierModal from "../components/suppliers/SupplierModal";
import styles from "./suppliersPage.module.css";

const SuppliersPage = () => {
  const dispatch = useDispatch();
  const {
    items: suppliers,
    loading,
    error,
  } = useSelector((state) => state.suppliers);

  const [filterName, setFilterName] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredSuppliers(suppliers);
  }, [suppliers]);

  const handleFilter = () => {
    const filtered = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = (id) => {
    dispatch(deleteSupplier(id));
  };

  const handleCloseModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  };

  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.suppliersPage}>
      {loading && <p>Loading suppliers...</p>}
      {error && <p className={styles.error}>{error.message || error}</p>}

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="User Name"
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
        <button
          className={styles.openModalButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add Supplier
        </button>
      </div>

      {isModalOpen && (
        <SupplierModal supplier={selectedSupplier} onClose={handleCloseModal} />
      )}

      <SuppliersTable
        suppliers={currentSuppliers}
        handleEditSupplier={handleEditSupplier}
        handleDeleteSupplier={handleDeleteSupplier}
      />
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(filteredSuppliers.length / itemsPerPage) },
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

export default SuppliersPage;
