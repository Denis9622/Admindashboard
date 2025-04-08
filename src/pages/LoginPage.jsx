import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authOperations.js";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./loginPage.module.scss";
import PillImage from "../components/assets/pill.png";
import Rectangle from "../components/assets/rectangle1.png";
import Logo from "../components/assets/authenticatedLogo.svg";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Очищаем ошибку при изменении полей
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    } else {
      setError(result.payload?.message || "Ошибка входа");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className={styles.loginPage}>
      <NavLink to={isAuthenticated ? "/" : "/login"} className={styles.logoContainer}>
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
            <input
              type="email"
              name="email"
              placeholder="Email address"
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
              Log in
            </button>

            <a href="/signup" className={styles.signupLink}>
              Don&#39;t have an account?
            </a>
          </form>
        </div>
      </div>
      <img src={Rectangle} alt="Background" className={styles.backgroundImage} />
    </div>
  );
};

export default LoginPage;
