import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addSupplier,
  updateSupplier,
} from "../../redux/suppliers/suppliersSlice";
import styles from "./supplierModal.module.css";

const SupplierModal = ({ supplier, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: supplier ? supplier.name : "",
    company: supplier ? supplier.company : "",
    address: supplier ? supplier.address : "",
    amount: supplier ? supplier.amount : 0,
    deliveryDate: supplier
      ? supplier.deliveryDate
      : new Date().toISOString().slice(0, 16),
    status: supplier ? supplier.status : "Pending",
  });

  const handleSubmit = async () => {
    if (formData.amount <= 0) {
      alert("Amount must be positive");
      return;
    }

    try {
      if (supplier) {
        await dispatch(
          updateSupplier({ id: supplier._id, supplierData: formData })
        );
      } else {
        await dispatch(addSupplier(formData));
      }
      onClose();
    } catch (error) {
      console.error("Error updating supplier:", error);
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
        <h2>{supplier ? "Edit Supplier" : "Add Supplier"}</h2>
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
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.rightColumn}>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              required
            />
            <div className={styles.dateInputContainer}>
              <input
                type="datetime-local"
                value={formData.deliveryDate}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
                required
              />
              <svg className={styles.calendarIcon}>
                <use href="/public/sprite.svg#icon-calendar-small"></use>
              </svg>
            </div>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit}>
            {supplier ? "Update Supplier" : "Add Supplier"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
