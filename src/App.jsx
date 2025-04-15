import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "./redux/auth/selectors";
import { setUser, clearAuthState } from "./redux/auth/authSlice";
import PrivateRoute from "./components/routes/PrivateRoute";
import RestrictedRoute from "./components/routes/RestrictedRoute";
import SharedLayout from "./components/shared/SharedLayout";
import Loader from "./components/Loader/Loader.jsx";
import css from "./App.module.css";

const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx"));
const CustomersPage = lazy(() => import("./pages/CustomersPage.jsx"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage/NotFoundPage.jsx")
);

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setUser(JSON.parse(user))); 
    } else {
      dispatch(clearAuthState());
    }
  }, [dispatch]);

  return (
    <div className={css.appcentr}>
      <div className={css.app}>
        <Suspense fallback={<Loader loader={true} />}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute
                  redirectTo="/login"
                  component={<SharedLayout isAuthenticated={isAuthenticated} />}
                />
              }
            >
              <Route
                index
                element={<PrivateRoute component={<DashboardPage />} />}
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute
                    redirectTo="/login"
                    component={<DashboardPage />}
                  />
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute
                    redirectTo="/login"
                    component={<OrdersPage />}
                  />
                }
              />
              <Route
                path="/products"
                element={
                  <PrivateRoute
                    redirectTo="/login"
                    component={<ProductsPage />}
                  />
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute
                    redirectTo="/login"
                    component={<CustomersPage />}
                  />
                }
              />
              <Route
                path="/suppliers"
                element={
                  <PrivateRoute
                    redirectTo="/login"
                    component={<SuppliersPage />}
                  />
                }
              />
            </Route>
            <Route
              path="/login"
              element={
                <RestrictedRoute
                  redirectTo="/dashboard"
                  component={<LoginPage />}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <RestrictedRoute
                  redirectTo="/dashboard"
                  component={<SignupPage />}
                />
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
