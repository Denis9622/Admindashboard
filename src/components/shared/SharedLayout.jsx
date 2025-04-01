import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import css from "./sharedLayout.module.css";

const SharedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={css.layout}>
      <header className={css.header}>
        <Header toggleSidebar={toggleSidebar} />
      </header>
      <div className={css.content}>
        <aside className={css.sidebar}>
          <Sidebar isOpen={isSidebarOpen} />
        </aside>
        <main className={css.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SharedLayout;
