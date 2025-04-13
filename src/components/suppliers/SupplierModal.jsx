import { useDispatch } from "react-redux";
import { addSupplier, updateSupplier } from "../../redux/suppliers/suppliersSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./supplierModal.module.scss";

// Валидация с Yup по твоей модели
const supplierSchema = Yup.object().shape({
  name: Yup.string().required("Suppliers Info is required"),
  company: Yup.string().required("Company is required"),
  address: Yup.string().required("Address is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than 0"),
  deliveryDate: Yup.date()
    .required("Delivery date is required")
    .typeError("Invalid date"),
  status: Yup.string()
    .oneOf(["Active", "Deactive"], "Invalid status")
    .required("Status is required"),
});

const SupplierModal = ({ supplier, onClose }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(supplierSchema),
    // В defaultValues изменить
    defaultValues: {
      name: supplier?.name || "",
      company: supplier?.company || "",
      address: supplier?.address || "",
      amount: supplier?.amount || "amount",
      deliveryDate: supplier?.deliveryDate
        ? new Date(supplier.deliveryDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      status: supplier?.status || "", // Изменено с "Status" на пустую строку
    },
  });

  const onSubmit = async (data) => {
    try {
      if (supplier) {
        await dispatch(updateSupplier({ id: supplier._id, supplierData: data }));
      } else {
        await dispatch(addSupplier(data));
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

        <h2>{supplier ? "Edit Supplier" : "Add a new supplier"}</h2>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.leftColumn}>
            <input
              type="text"
              placeholder="Suppliers Info"
              {...register("name")}
            />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}

            <input
              type="text"
              placeholder="Company"
              {...register("company")}
            />
            {errors.company && <p className={styles.error}>{errors.company.message}</p>}

          
             <input
              type="number"
              placeholder="Amount"
              {...register("amount")}
            />
            {errors.address && <p className={styles.error}>{errors.address.message}</p>}
          </div>

          <div className={styles.rightColumn}>
          <input
              type="text"
              placeholder="Address"
              {...register("address")}
            />
            {errors.amount && <p className={styles.error}>{errors.amount.message}</p>}

            <div className={styles.dateInputContainer}>
              <input
                type="datetime-local"
                {...register("deliveryDate")}
              />
              <svg className={styles.calendarIcon}>
                <use href="/public/sprite.svg#icon-calendar-small"></use>
              </svg>
            </div>
            {errors.deliveryDate && <p className={styles.error}>{errors.deliveryDate.message}</p>}

            <select {...register("status")}>
  <option value="" disabled>Status</option>
  <option value="Active">Active</option>
  <option value="Deactive">Deactive</option>
</select>
            {errors.status && <p className={styles.error}>{errors.status.message}</p>}
          </div>
        </form>

        <div className={styles.buttonContainer}>
          <button
            className={styles.primaryButton}
            onClick={handleSubmit(onSubmit)}
          >
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
