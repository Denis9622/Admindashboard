import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "../../redux/products/productsOperations.js";
import CustomSelect from "./CustomSelect.jsx";

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product ? product.name : "",
    category: product ? product.category : "",
    stock: product ? product.stock : "",
    suppliers: product ? product.suppliers.join(", ") : "",
    price: product ? product.price : "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories([
      "Medicine",
      "Head",
      "Hand",
      "Dental Care",
      "Skin Care",
      "Eye Care",
      "Vitamins & Supplements",
      "Orthopedic Products",
      "Baby Care",
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...formData,
      suppliers: formData.suppliers.split(",").map((s) => s.trim()),
    };
    try {
      if (product) {
        await dispatch(
          updateProduct({ ...updatedProduct, _id: product._id })
        ).unwrap();
      } else {
        await dispatch(addProduct(updatedProduct)).unwrap();
      }
      await dispatch(fetchProducts());
      onClose();
    } catch (error) {
      console.error("Ошибка обновления продукта:", error);
    }
  };

  return (
    <div >
      <div >
        <button  onClick={onClose}>
          <svg >
            <use href="/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <h2>{product ? "Edit Product" : "Add a new product"}</h2>
        <form >
          <div >
            <input
              type="text"
              name="name"
              placeholder="Product Info"
              value={formData.name}
              onChange={handleChange}
              required
             
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div >
            <CustomSelect
              options={categories}
              selected={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            />
            <input
              type="text"
              name="suppliers"
              placeholder="Suppliers"
              value={formData.suppliers}
              onChange={handleChange}
              required
            />
          </div>
        </form>
        <div >
          <button  onClick={handleSubmit}>
            {product ? "Save" : "Add"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
