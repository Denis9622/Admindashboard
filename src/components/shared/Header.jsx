import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/authOperations";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import Logo from "../assets/authenticatedLogo.svg"; // Логотип

function Header({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <svg className={styles.menuIcon}>
          <use href="/sprite.svg#icon-menu"></use>
        </svg>
      </button>
      <NavLink to={isAuthenticated ? "/" : "/login"}>
        <img src={Logo} alt="Logo" className={styles.logoImg} />
      </NavLink>
      <>
        <nav className={styles.nav}>
          <ul className={styles.ulClass}>
            <li>
              <NavLink to="/" className={styles.logotxt}>
                Medicine Store
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={styles.navLink}>
                Dashboard{" | "}
                <span className={styles.username}>
                  {user?.email || "No Email"}
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className={styles.userAuth}>
          <button onClick={handleLogout} className={styles.logoutUserButton}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#logout"></use>
            </svg>
          </button>
        </div>
      </>
    </header>
  );
}

export default Header;
