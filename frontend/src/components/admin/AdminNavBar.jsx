import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { clearAuthData } from "../../api/authApi";
import ConfirmLogout from "../../modals/ConfirmLogout";

import "./styles/AdminNavBar.css";

function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //Close mobile menu when navigating to a different page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function handleConfirmLogout() {
    clearAuthData();
    setIsConfirmLogoutOpen(false);
    navigate("/auth");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h1 className="admin-logo">Admin Dashboard</h1>

        <button
          type="button"
          className="admin-menu-toggle"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          aria-label="Toggle admin menu"
          aria-expanded={isMenuOpen}
        >
          <FaBars aria-hidden="true" />
        </button>
      </div>

      {/* Add mobile menu class when hamburger menu is open */}
      <nav className={`admin-nav${isMenuOpen ? " admin-nav-open" : ""}`}>
        <NavLink
          to="/admin/records"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Manage Records
        </NavLink>

        <NavLink
          to="/admin/carts"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          View User Carts
        </NavLink>

        <NavLink to="/records" className="admin-nav-link">
          Browse Store
        </NavLink>

        <button
          type="button"
          className="admin-logout-button"
          onClick={() => setIsConfirmLogoutOpen(true)}
        >
          Logout
        </button>
      </nav>

      <ConfirmLogout
        isOpen={isConfirmLogoutOpen}
        onCancel={() => setIsConfirmLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}

export default AdminNav;