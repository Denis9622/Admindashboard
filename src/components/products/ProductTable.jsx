import styles from "./productTable.module.css";

const ProductTable = ({ products, handleEditProduct, handleDeleteProduct }) => {
  return (
    <div className={styles.productTable}>
      <h3>All Products</h3>
      <div className={styles.scrollWrapper}>
        <div className={styles.recentProducts}>
          <table>
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Suppliers</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noProducts}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.suppliers.join(", ")}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className={styles.buttonBox}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditProduct(product)}
                        >
                          <svg className={styles.iconEdit}>
                            <use href="/sprite.svg#icon-edit"></use>
                          </svg>
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteProduct(product._id)}
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

export default ProductTable;
