import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../redux/auth/authOperations.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./authForm.module.css";
import PillImage from "../assets/pill.png";

const AuthForm = ({ isSignUp }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword(!showRepeatPassword);

  const initialValues = {
    name: isSignUp ? "" : undefined,
    email: "",
    password: "",
    repeatPassword: isSignUp ? "" : undefined,
  };

  const validationSchema = Yup.object({
    name: isSignUp ? Yup.string().required("Name is required") : Yup.string(),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    repeatPassword: isSignUp
      ? Yup.string()
          .required("Repeat password is required")
          .oneOf([Yup.ref("password")], "Passwords must match")
      : Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const action = isSignUp ? registerUser : loginUser;
      const result = await dispatch(action(userData));

      if (result.meta.requestStatus === "fulfilled") {
        window.location.href = "/dashboard";
      } else {
        console.error(
          isSignUp ? "Registration error:" : "Login error:",
          result.payload
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <h1 className={styles.title}>
          {isSignUp ? (
            <>
              Welcome to <span className={styles.greenText}>PharmEasy</span>
            </>
          ) : (
            <>
              Your medication, delivered Say goodbye to all{" "}
              <span className={styles.greenText}>your healthcare</span> worries
              with us
            </>
          )}
        </h1>
        <img src={PillImage} alt="Pill" className={styles.pillImage} />
      </div>

      <div className={styles.rightSide}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className={styles.form}>
              {isSignUp && (
                <div className={styles.inputGroup}>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className={`${styles.input} ${
                      touched.name && errors.name ? styles.inputError : ""
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className={styles.error}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className={`${styles.input} ${
                    touched.email && errors.email ? styles.inputError : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className={`${styles.input} ${
                      touched.password && errors.password
                        ? styles.inputError
                        : ""
                    }`}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggleIcon}
                  >
                    {showPassword ? (
                      <svg className={styles.icon}>
                        <use href="/public/sprite.svg#icon-eye"></use>
                      </svg>
                    ) : (
                      <svg className={styles.icon}>
                        <use href="/public/sprite.svg#icon-eye-off"></use>
                      </svg>
                    )}
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              {isSignUp && (
                <div className={styles.inputGroup}>
                  <div className={styles.passwordWrapper}>
                    <Field
                      type={showRepeatPassword ? "text" : "password"}
                      name="repeatPassword"
                      placeholder="Repeat password"
                      className={`${styles.input} ${
                        touched.repeatPassword && errors.repeatPassword
                          ? styles.inputError
                          : ""
                      }`}
                    />
                    <span
                      onClick={toggleRepeatPasswordVisibility}
                      className={styles.passwordToggleIcon}
                    >
                      {showRepeatPassword ? (
                        <svg className={styles.icon}>
                          <use href="/public/sprite.svg#icon-eye"></use>
                        </svg>
                      ) : (
                        <svg className={styles.icon}>
                          <use href="/public/sprite.svg#icon-eye-off"></use>
                        </svg>
                      )}
                    </span>
                  </div>
                  <ErrorMessage
                    name="repeatPassword"
                    component="div"
                    className={styles.error}
                  />
                </div>
              )}

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSignUp ? "Register" : "Log in"}
              </button>

              {isSignUp ? (
                <a href="/login" className={styles.authLink}>
                  Already have an account?
                </a>
              ) : (
                <a href="/signup" className={styles.authLink}>
                  Don&#39;t have an account?
                </a>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
