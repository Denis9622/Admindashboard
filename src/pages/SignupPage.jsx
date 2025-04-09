import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authOperations.js";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./signupPage.module.scss";
import PillImage from "../components/assets/pill.png";
import Rectangle from "../components/assets/rectangle1.png";
import Logo from "../components/assets/authenticatedLogo.svg";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setSuccessMessage("");
      
      const result = await dispatch(registerUser(data));
      
      if (result.meta.requestStatus === "fulfilled") {
        setSuccessMessage("Registration successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setServerError(result.payload?.message || "Registration failed");
      }
    } catch (err) {
      setServerError(err?.message || "An error occurred during registration");
    }
  };

  return (
    <div className={styles.loginPage}>
      <NavLink to={isAuthenticated ? "/" : "/signup"} className={styles.logoContainer}>
        <img src={Logo} alt="Logo" className={styles.logoImg} />
        E-Pharmacy
      </NavLink>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <h1 className={styles.title}>
            Your medication, delivered Say goodbye to all{" "}
            <span className={styles.greenText}>your healthcare</span> worries
            with us
          </h1>
          <img src={PillImage} alt="Pill" className={styles.pillImage} />
        </div>

        <div className={styles.rightSide}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {serverError && <div className={styles.errorMessage}>{serverError}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Name"
                className={styles.input}
                {...register("name")}
              />
              {errors.name && <p className={styles.fieldError}>{errors.name.message}</p>}
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Email address"
                className={styles.input}
                {...register("email")}
              />
              {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="tel"
                placeholder="Phone number"
                className={styles.input}
                {...register("phone")}
              />
              {errors.phone && <p className={styles.fieldError}>{errors.phone.message}</p>}
            </div>

            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={styles.input}
                {...register("password")}
              />
              <span
                onClick={togglePasswordVisibility}
                className={styles.passwordToggleIcon}
              >
                {showPassword ? (
                  <svg className={styles.icon}>
                    <use href="/sprite.svg#icon-eye"></use>
                  </svg>
                ) : (
                  <svg className={styles.icon}>
                    <use href="/sprite.svg#icon-eye-off"></use>
                  </svg>
                )}
              </span>
              {errors.password && <p className={styles.fieldError}>{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>

            <NavLink to="/login" className={styles.signupLink}>
              Already have an account?
            </NavLink>
          </form>
        </div>
      </div>
      <img src={Rectangle} alt="Background" className={styles.backgroundImage} />
    </div>
  );
};

export default SignupPage;
