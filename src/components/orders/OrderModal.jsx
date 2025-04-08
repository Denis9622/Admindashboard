import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, updateOrder } from "../../redux/orders/ordersOperations";
import styles from "./orderModal.module.css";

const OrderModal = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const { items: customers } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    customerId: order ? order.customerId : "",
    address: order ? order.address : "",
    products: order ? order.products.join(",") : "",
    orderDate: order ? order.orderDate : new Date().toISOString().slice(0, 16),
    price: order ? order.price : 0,
    status: order ? order.status : "Pending",
  });

  const handleSubmit = async () => {
    try {
      const updatedOrder = {
        ...formData,
        products: formData.products.split(","),
      };

      if (order) {
        await dispatch(updateOrder({ id: order._id, orderData: updatedOrder }));
      } else {
        await dispatch(addOrder(updatedOrder));
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
        <form className={styles.form}>
          <div className={styles.leftColumn}>
            <select
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: e.target.value })
              }
              className={styles.select}
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Products (comma separated)"
              value={formData.products}
              onChange={(e) =>
                setFormData({ ...formData, products: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.dateInputContainer}>
              <input
                type="datetime-local"
                value={formData.orderDate}
                onChange={(e) =>
                  setFormData({ ...formData, orderDate: e.target.value })
                }
                required
              />
              <svg className={styles.calendarIcon}>
                <use href="/public/sprite.svg#icon-calendar-small"></use>
              </svg>
            </div>
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={styles.select}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit}>
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
