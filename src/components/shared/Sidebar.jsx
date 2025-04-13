import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.scss"; // Подключаем стили

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        <svg className={styles.closeIcon}>
          <use href="/sprite.svg#icon-x"></use>
        </svg>
      </button>
      <ul className={styles.menu}>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-dashboard"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => 
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-shopping-cart"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-flask-fill"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/suppliers" 
            className={({ isActive }) => 
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-pharmacy"></use>
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/customers" 
            className={({ isActive }) => 
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <svg className={styles.icon}>
              <use href="/sprite.svg#icon-users"></use>
            </svg>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
