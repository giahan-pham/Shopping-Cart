import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecordShopping from "./pages/RecordShoppingPage";
import CartPage from "./pages/CartPage";

import ManageRecords from "./pages/admin/ManageRecords";
import ManageCarts from "./pages/admin/ManageCarts";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/login" || location.pathname === "/register";
  
  return (
    <div className="App">
      {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/records" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/records" element={<RecordShopping />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Admin routes */}
        <Route
          path="/admin/records"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/carts"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageCarts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
