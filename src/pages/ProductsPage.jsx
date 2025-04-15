import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../redux/products/productsOperations.js";
import { refreshToken } from "../redux/auth/authOperations.js";
import ProductModal from "../components/products/ProductModal.jsx";
import ProductTable from "../components/products/ProductTable.jsx";
import styles from "./productsPage.module.scss";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .then((fetchedItems) => setFilteredProducts(fetchedItems)) 
      .catch((error) => {
        if (error === "Refresh token required") {
          dispatch(refreshToken()).then(() => dispatch(fetchProducts()));
        }
      });
  }, [dispatch, isModalOpen]); 

  const handleFilter = () => {
    const filtered = items.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleEditProduct = async (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (_id) => {
    try {
      await dispatch(deleteProduct(_id)).unwrap(); 
      const updatedProducts = items.filter((product) => product._id !== _id); 
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error);
    }
  };

  const handleAddProduct = async () => {
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.productsPage}>
      <div className={styles.filterContainer}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.filterInput}
          />
          <button onClick={handleFilter} className={styles.filterButton}>
            <svg className={styles.filterIcon}>
              <use href="/sprite.svg#icon-filter"></use>
            </svg>
            Filter
          </button>
        </div>
        <div className={styles.containerButton}>
        <button onClick={handleAddProduct} className={styles.addButton}>
          <img src="/Vector.svg" alt="Add" className={styles.iconAdd} />
        </button>
        <p className={styles.textAdd}>Add a new product</p>
      </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error.message || error}</p>}
      <ProductTable
        products={currentProducts}
        handleDeleteProduct={handleDeleteProduct}
        handleEditProduct={handleEditProduct}
      />
      {isModalOpen && (
        <ProductModal
          product={currentProduct}
          onClose={() => setModalOpen(false)}
        />
      )}
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(filteredProducts.length / itemsPerPage) },
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

export default ProductsPage;
