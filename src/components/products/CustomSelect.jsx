import { useState } from "react";
import styles from "./CustomSelect.module.css";

const CustomSelect = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Добавляем tabIndex для фокуса
      >
        <span>{selected || "Category"}</span>
        <span className={styles.arrow}>
          <svg className={styles.iconx}>
            <use href="/sprite.svg#icon-chevron-down"></use>
          </svg>
        </span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
