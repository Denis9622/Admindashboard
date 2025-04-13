import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addProduct,
  updateProduct,
  fetchProducts,
} from "../../redux/products/productsOperations.js";
import CustomSelect from "./CustomSelect.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./prodModal.module.scss";

const ProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    category: Yup.string().required("Category is required"),
    stock: Yup.number().min(0, "Stock must be non-negative").required("Stock is required"),
    price: Yup.number().min(0, "Price must be non-negative").required("Price is required"),
    suppliers: Yup.string().required("Suppliers are required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      stock: product?.stock || "",
      suppliers: product?.suppliers?.join(", ") || "",
      price: product?.price || "",
    }
  });

  const onSubmit = async (data) => {
    const updatedProduct = {
      ...data,
      suppliers: data.suppliers.split(",").map((s) => s.trim()),
    };
    try {
      if (product) {
        await dispatch(updateProduct({ ...updatedProduct, _id: product._id })).unwrap();
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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg className={styles.iconx}>
            <use href="/sprite.svg#icon-x"></use>
          </svg>
        </button>
        <h2>{product ? "Edit Product" : "Add a new product"}</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.leftColumn}>
            <input
              type="text"
              {...register("name")}
              placeholder="Product Info"
              className={`${styles.inputtext} ${errors.name ? styles.inputError : ""}`}
            />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}

            <input
              type="number"
              {...register("stock")}
              placeholder="Stock"
              className={errors.stock ? styles.inputError : ""}
            />
            {errors.stock && <p className={styles.error}>{errors.stock.message}</p>}

            <input
              type="number"
              {...register("price")}
              placeholder="Price"
              className={errors.price ? styles.inputError : ""}
            />
            {errors.price && <p className={styles.error}>{errors.price.message}</p>}
          </div>

          <div className={styles.rightColumn}>
            <CustomSelect
              options={categories}
              selected={product?.category}
              onChange={(value) => setValue("category", value)}
            />
            {errors.category && <p className={styles.error}>{errors.category.message}</p>}

            <input
              type="text"
              {...register("suppliers")}
              placeholder="Suppliers"
              className={errors.suppliers ? styles.inputError : ""}
            />
            {errors.suppliers && <p className={styles.error}>{errors.suppliers.message}</p>}
          </div>
        </form>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit(onSubmit)}>
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
