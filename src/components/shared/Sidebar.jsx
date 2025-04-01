import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css"; // Подключаем стили

const Sidebar = ({ isOpen }) => {
  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <ul className={styles.menu}>
        <li>
          <NavLink to="/dashboard" className={styles.menuItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-dashboard"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink to="/orders" className={styles.menuItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-shopping-cart"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={styles.menuItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-flask-fill"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={styles.menuItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-users"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink to="/suppliers" className={styles.menuItem}>
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-pharmacy"></use>
            </svg>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
