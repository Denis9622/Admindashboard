import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../redux/customers/customersOperations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./customerModal.module.scss";

const CustomerModal = ({ customer, onClose }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
      .matches(/^\+?[0-9]{7,14}$/, "Invalid phone number")
      .required("Phone is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: customer?.name || "",
      email: customer?.email || "",
      address: customer?.address || "",
      phone: customer?.phone || ""
    }
  });

  useEffect(() => {
    reset({
      name: customer?.name || "",
      email: customer?.email || "",
      address: customer?.address || "",
      phone: customer?.phone || ""
    });
  }, [customer, reset]);

  const onSubmit = async (data) => {
    try {
      if (customer) {
        await dispatch(updateCustomer({ id: customer._id, customerData: data }));
      } else {
        await dispatch(addCustomer(data));
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

        {/* структура формы не изменена! */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.leftColumn}>
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className={errors.name ? styles.inputError : ""}
            />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>

          <div className={styles.rightColumn}>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className={errors.address ? styles.inputError : ""}
            />
            {errors.address && <p className={styles.error}>{errors.address.message}</p>}

            <input
              type="text"
              placeholder="Phone"
              {...register("phone")}
              className={errors.phone ? styles.inputError : ""}
            />
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>
        </form>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit(onSubmit)}>
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
