import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/authOperations";
import { useNavigate, NavLink, useLocation } from "react-router-dom"; // Добавляем useLocation
import styles from "./Header.module.scss";
import Logo from "../assets/authenticatedLogo.svg";

function Header({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий путь

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Функция для определения заголовка на основе пути
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/customers':
        return 'All customers';
      case '/orders':
        return 'All orders';
      case '/products':
        return 'All products';
      case '/suppliers':
        return 'All suppliers';
      default:
        return 'Dashboard';
    }
  };

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
              <NavLink to={location.pathname} className={styles.navLink}>
                {getPageTitle()}{" | "}
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
