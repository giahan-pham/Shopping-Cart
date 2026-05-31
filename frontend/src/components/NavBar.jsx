import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

import { clearAuthData, getUserData } from "../api/authApi";
import ConfirmLogout from "../modals/ConfirmLogout";

import "./NavBar.css";

function NavBar({ onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const user = getUserData();
  const isAuthPage = location.pathname === "/auth";

  function handleConfirmLogout() {
    clearAuthData();
    setIsConfirmLogoutOpen(false);
    navigate("/auth");
  }

  return (
    <header className="navbar">
      <Link to="/records" className="navbar-brand">
        Record Store
      </Link>

      <nav className="navbar-links">
        {!user && !isAuthPage && (
          <Link to="/auth" className="navbar-link">
            Login / Register
          </Link>
        )}

        {user && (
          <>

            <span className="navbar-user">Hi, {user.username}</span>

            {user.role === "admin" && (
              <button
                type="button"
                className="navbar-link"
                onClick={() => navigate("/admin/records")}
              >
                Dashboard
              </button>
            )}

            <button
              type="button"
              className="navbar-button navbar-button-with-icon"
              onClick={onOpenCart}
            >
              <FaShoppingCart className="navbar-button-icon" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="navbar-button navbar-button-logout"
              onClick={() => setIsConfirmLogoutOpen(true)}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <ConfirmLogout
        isOpen={isConfirmLogoutOpen}
        onCancel={() => setIsConfirmLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}

export default NavBar;