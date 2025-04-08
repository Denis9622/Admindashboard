import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authOperations.js";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./signupPage.module.scss";
import PillImage from "../components/assets/pill.png";
import Rectangle from "../components/assets/rectangle1.png";
import Logo from "../components/assets/authenticatedLogo.svg";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // добавляем поле телефона
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    try {
      const result = await dispatch(registerUser(formData));
      if (result.meta.requestStatus === "fulfilled") {
        setSuccessMessage("Регистрация успешна!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        // Получаем сообщение об ошибке из payload
        const errorMessage = result.payload?.message || "Ошибка при регистрации";
        setError(errorMessage);
      }
    } catch (err) {
      setError(err?.message || "Произошла ошибка при регистрации");
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
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={styles.input}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className={styles.input}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className={styles.input}
              onChange={handleChange}
              required
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={styles.input}
                onChange={handleChange}
                required
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
            </div>
            <button type="submit" className={styles.button}>
              Sign up
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
