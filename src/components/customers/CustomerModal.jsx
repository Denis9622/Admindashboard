import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addCustomer,
  updateCustomer,
} from "../../redux/customers/customersOperations";
import styles from "./customerModal.module.css";

const CustomerModal = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: customer ? customer.name : "",
    email: customer ? customer.email : "",
    address: customer ? customer.address : "",
    phone: customer ? customer.phone : "",
  });

  const handleSubmit = async () => {
    try {
      if (customer) {
        await dispatch(
          updateCustomer({ id: customer._id, customerData: formData })
        );
      } else {
        await dispatch(addCustomer(formData));
      }
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
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
        <h2>{customer ? "Edit Customer" : "Add Customer"}</h2>
        <form className={styles.form}>
          <div className={styles.leftColumn}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.rightColumn}>
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
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit}>
            {customer ? "Update Customer" : "Add Customer"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
