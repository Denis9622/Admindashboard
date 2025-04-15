import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, updateOrder } from "../../redux/orders/ordersOperations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./orderModal.module.scss";

const OrderModal = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const { items: customers } = useSelector((state) => state.customers);

  const validationSchema = Yup.object().shape({
    customerId: Yup.string().required("Please select a customer"),
    address: Yup.string().required("Address is required"),
    products: Yup.string().required("Products are required"),
    orderDate: Yup.string().required("Order date is required"),
    price: Yup.number().min(0, "Price must be at least 0").required("Price is required"),
    status: Yup.string().oneOf(
      ["Pending", "Shipped", "Delivered"],
      "Invalid status"
    ).required("Status is required")
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customerId: order?.customerId || "",
      address: order?.address || "",
      products: order?.products?.join(",") || "",
      orderDate: order?.orderDate || new Date().toISOString().slice(0, 16),
      price: order?.price || 0,
      status: order?.status || "Pending"
    }
  });

  useEffect(() => {
    if (order) {
      setValue("customerId", order.customerId);
      setValue("address", order.address);
      setValue("products", order.products.join(","));
      setValue("orderDate", order.orderDate);
      setValue("price", order.price);
      setValue("status", order.status);
    }
  }, [order, setValue]);

  const onSubmit = async (data) => {
    try {
      const preparedData = { ...data, products: data.products.split(",") };

      if (order) {
        await dispatch(updateOrder({ id: order._id, orderData: preparedData }));
      } else {
        await dispatch(addOrder(preparedData));
      }
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
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
        <h2>{order ? "Edit Order" : "Add Order"}</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.leftColumn}>
            <select {...register("customerId")} className={styles.select}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && <p className={styles.error}>{errors.customerId.message}</p>}

            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className={errors.address ? styles.inputError : ""}
            />
            {errors.address && <p className={styles.error}>{errors.address.message}</p>}

            <input
              type="text"
              placeholder="Products (comma separated)"
              {...register("products")}
              className={errors.products ? styles.inputError : ""}
            />
            {errors.products && <p className={styles.error}>{errors.products.message}</p>}
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.dateInputContainer}>
              <input
                type="datetime-local"
                {...register("orderDate")}
                className={errors.orderDate ? styles.inputError : ""}
              />
              <svg className={styles.calendarIcon}>
                <use href="/public/sprite.svg#icon-calendar-small"></use>
              </svg>
            </div>
            {errors.orderDate && <p className={styles.error}>{errors.orderDate.message}</p>}

            <input
              type="number"
              placeholder="Price"
              {...register("price")}
              className={errors.price ? styles.inputError : ""}
            />
            {errors.price && <p className={styles.error}>{errors.price.message}</p>}

            <select {...register("status")} className={styles.select}>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            {errors.status && <p className={styles.error}>{errors.status.message}</p>}
          </div>
        </form>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit(onSubmit)}>
            {order ? "Update Order" : "Add Order"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
